using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities;

/// <summary>
/// A puzzle hidden somewhere on the website. The first player to answer it claims the reward;
/// after that it's locked for everyone else. The puzzle, answer and reward live only in the database
/// so players can't read them from the Angular bundle.
/// </summary>
[Table("secrets", Schema = "luminia")]
public class Secret
    : EntityBase
{
    /// <summary>The key the website uses to find this secret (e.g. "luana-weapon").</summary>
    [MaxLength(64)]
    public required string SecretKey { get; set; }

    /// <summary>Shown as the title of the secret's popup and in the Discord notification.</summary>
    [MaxLength(100)]
    public required string Name { get; set; }

    /// <summary>
    /// "answer": players type the answer. "path": players walk it, by visiting pages in order;
    /// Answer then holds the pages separated by '>', e.g. "404 > pantheon > calendar".
    /// </summary>
    [MaxLength(16)]
    public string Kind { get; set; } = SecretKinds.Answer;

    public required string Puzzle { get; set; }

    /// <summary>Never sent to the website. Compared ignoring case, spaces and punctuation, see <c>SecretsController.NormalizeAnswer</c>.</summary>
    [MaxLength(200)]
    public required string Answer { get; set; }

    /// <summary>Shown only to the player who claims the secret.</summary>
    public required string Reward { get; set; }

    [MaxLength(64)]
    public string? ClaimedBy { get; set; }
    public DateTime? ClaimedDate { get; set; }

    /// <summary>Number of pages in a path secret's path, or null for other secrets.</summary>
    [NotMapped]
    public int? PathLength => Kind == SecretKinds.Path ? Answer.Split('>').Length : null;
}

public static class SecretKinds
{
    public const string Answer = "answer";
    public const string Path = "path";
}
