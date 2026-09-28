namespace LuminiaAPI.Dtos.Secrets;

public class SecretAttemptResultDto
{
    /// <summary>True when this attempt claimed the secret.</summary>
    public bool Claimed { get; set; }

    /// <summary>Whether the answer was right, also when the secret was already claimed.</summary>
    public bool Correct { get; set; }

    /// <summary>Who holds the secret, if anyone.</summary>
    public string? ClaimedBy { get; set; }
    public DateTime? ClaimedDate { get; set; }

    /// <summary>Only filled in for the player who just claimed the secret.</summary>
    public string? Reward { get; set; }
}
