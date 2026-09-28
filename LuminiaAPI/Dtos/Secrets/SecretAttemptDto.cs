namespace LuminiaAPI.Dtos.Secrets;

public class SecretAttemptDto
{
    /// <summary>Name of the character trying to claim the secret.</summary>
    public string Name { get; set; } = "";
    public string Answer { get; set; } = "";
}
