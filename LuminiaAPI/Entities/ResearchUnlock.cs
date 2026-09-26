using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities;

/// <summary>
/// One unlocked node of the Alchemical Research Tree. The tree itself (layout, costs, descriptions)
/// lives in the Angular app (research-tree.data.ts); NodeId is the node's id there.
/// </summary>
[Table("alchemicalresearchtreeunlocks", Schema = "luminia")]
public class ResearchUnlock
    : EntityBase
{
    [MaxLength(64)]
    public required string NodeId { get; set; }
}
