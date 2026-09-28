namespace LuminiaAPI.Dtos.Secrets;

/// <summary>What anyone may know about a secret: the puzzle and whether (and by whom) it was claimed.</summary>
public class SecretDto
{
    public required string SecretKey { get; set; }
    public required string Name { get; set; }
    /// <summary>"answer" or "path", see <c>Secret.Kind</c>.</summary>
    public required string Kind { get; set; }
    public required string Puzzle { get; set; }
    /// <summary>How many pages the path has (path secrets only), so the website knows how far back to look.</summary>
    public int? PathLength { get; set; }
    public string? ClaimedBy { get; set; }
    public DateTime? ClaimedDate { get; set; }
}
