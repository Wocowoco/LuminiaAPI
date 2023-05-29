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
        public string? PopupText { get; set; }
        [MaxLength(500)]
        public string? AdminText { get; set; }
    }
}
