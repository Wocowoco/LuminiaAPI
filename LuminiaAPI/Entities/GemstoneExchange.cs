using LuminiaAPI.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities;

[Table("gemstoneexchange", Schema = "luminia")]
public class GemstoneExchange
    : EntityBase
{
    public Gemstone GemstoneId { get; set; }
    public int Day { get; set; }
    public double Price { get; set; }
}
