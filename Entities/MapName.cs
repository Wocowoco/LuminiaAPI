using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities;

[Table("mapname", Schema = "luminia")]
public class MapName
    : EntityBase
{
    [MaxLength(45)]
    public required string NameOfMap { get; set; }
    [MaxLength(45)]
    public required string NameOfFolder { get; set; }
}
