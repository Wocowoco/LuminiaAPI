using LuminiaAPI.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities
{
    [Table("marker", Schema = "Luminia")]
    public class Marker
        : EntityBase
    {
        public decimal PosX { get; set; }
        public decimal PosY { get; set; }
        public MapLayer MapLayerId { get; set; }
        [MaxLength(500)]
        public string? TitleText { get; set; }
        [MaxLength(500)]
        public string? DescriptionText { get; set; }
        [MaxLength(500)]
        public string? AdminText { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        [MaxLength(100)]
        public string? ImageUrl { get; set; }
    }
}
