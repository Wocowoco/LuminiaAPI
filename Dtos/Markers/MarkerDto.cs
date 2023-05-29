using LuminiaAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace LuminiaAPI.Dtos.Markers
{
    public class MarkerDto
    {
        public decimal PosX { get; set; }
        public decimal PosY { get; set; }
        public MapLayer MapLayerId { get; set; }
        [MaxLength(500)]
        public string? PopupText { get; set; }
    }
}
