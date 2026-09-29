using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Dtos.Secrets;
using LuminiaAPI.Entities;
using LuminiaAPI.Handlers.Secrets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace LuminiaAPI.Controllers;

/// <summary>
/// Puzzles hidden around the website. The puzzles themselves are public; answers are only ever compared server-side,
/// and the reward is only returned to the first player who answers correctly.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SecretsController
    : ControllerBase
{
    public const string AttemptRateLimitPolicy = "secret-attempts";
    public const string WalkRateLimitPolicy = "secret-walks";

    private readonly ILuminiaContext _luminiaContext;
    private readonly IMapper _mapper;
    private readonly ISecretClaimedNotifier _secretClaimedNotifier;

    public SecretsController(ILuminiaContext luminiaContext, IMapper mapper, ISecretClaimedNotifier secretClaimedNotifier)
    {
        _luminiaContext = luminiaContext;
        _mapper = mapper;
        _secretClaimedNotifier = secretClaimedNotifier;
    }

    [HttpGet("{secretKey}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetSecret(string secretKey)
    {
        var secret = _luminiaContext.Secret.SingleOrDefault(s => s.SecretKey == secretKey);
        if (secret == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<SecretDto>(secret));
    }

    /// <summary>
    /// Tries to answer a secret. The first correct answer claims it (and needs a name); after that,
    /// answers are still checked so slower players can try, but they never get the reward.
    /// </summary>
    [HttpPost("{secretKey}/attempt")]
    [EnableRateLimiting(AttemptRateLimitPolicy)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> AttemptSecretAsync(string secretKey, [FromBody] SecretAttemptDto attempt)
    {
        if (string.IsNullOrWhiteSpace(attempt.Answer) || attempt.Answer.Length > 200)
        {
            return BadRequest("Answer must be 1-200 characters long.");
        }

        var secret = _luminiaContext.Secret.AsNoTracking().SingleOrDefault(s => s.SecretKey == secretKey);
        if (secret == null)
        {
            return NotFound();
        }

        var correct = NormalizeAnswer(attempt.Answer) == NormalizeAnswer(secret.Answer);
        if (secret.ClaimedBy != null)
        {
            return Ok(new SecretAttemptResultDto { Correct = correct, ClaimedBy = secret.ClaimedBy, ClaimedDate = secret.ClaimedDate });
        }

        var name = attempt.Name?.Trim() ?? "";
        if (name.Length == 0 || name.Length > 64)
        {
            return BadRequest("Name must be 1-64 characters long.");
        }

        if (!correct)
        {
            return Ok(new SecretAttemptResultDto { Correct = false });
        }

        // Claim it with a single conditional UPDATE, so two correct answers arriving at the same time
        // can't both win: only the one that still finds ClaimedBy empty changes a row.
        var now = DateTime.Now;
        var updated = await _luminiaContext.Secret
            .Where(s => s.ObjectId == secret.ObjectId && s.ClaimedBy == null)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(s => s.ClaimedBy, name)
                .SetProperty(s => s.ClaimedDate, now)
                .SetProperty(s => s.UpdateDate, now)
                .SetProperty(s => s.UpdateUser, "LuminiaDb"));

        if (updated == 0)
        {
            var winner = _luminiaContext.Secret.AsNoTracking().Single(s => s.ObjectId == secret.ObjectId);
            return Ok(new SecretAttemptResultDto { Correct = true, ClaimedBy = winner.ClaimedBy, ClaimedDate = winner.ClaimedDate });
        }

        await _secretClaimedNotifier.NotifyAsync(secret, name);

        return Ok(new SecretAttemptResultDto
        {
            Claimed = true,
            Correct = true,
            ClaimedBy = name,
            ClaimedDate = now,
            Reward = secret.Reward,
        });
    }

    /// <summary>
    /// Checks whether the last pages a player visited (or, for a sequence secret, the last things they clicked)
    /// are the secret's path, without claiming it: the website asks this on every step once a player has read
    /// the directions, and only then asks for their name and calls <see cref="AttemptSecretAsync"/> with the same path.
    /// </summary>
    [HttpPost("{secretKey}/walk")]
    [EnableRateLimiting(WalkRateLimitPolicy)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public IActionResult WalkSecret(string secretKey, [FromBody] SecretAttemptDto walk)
    {
        if (string.IsNullOrWhiteSpace(walk.Answer) || walk.Answer.Length > 200)
        {
            return BadRequest("Path must be 1-200 characters long.");
        }

        var secret = _luminiaContext.Secret.AsNoTracking()
            .SingleOrDefault(s => s.SecretKey == secretKey && (s.Kind == SecretKinds.Path || s.Kind == SecretKinds.Sequence));
        if (secret == null)
        {
            return NotFound();
        }

        return Ok(new SecretAttemptResultDto
        {
            Correct = NormalizeAnswer(walk.Answer) == NormalizeAnswer(secret.Answer),
            ClaimedBy = secret.ClaimedBy,
            ClaimedDate = secret.ClaimedDate,
        });
    }

    /// <summary>Lowercases the answer and keeps only letters and digits, so "The Moon's Edge!" matches "the moons edge".</summary>
    public static string NormalizeAnswer(string answer)
    {
        return new string(answer.ToLowerInvariant().Where(char.IsLetterOrDigit).ToArray());
    }
}
