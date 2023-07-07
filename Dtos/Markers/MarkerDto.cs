using LuminiaAPI.Enums;
using System.ComponentModel.DataAnnotations;
using System.Security.Policy;

namespace LuminiaAPI.Dtos.Markers
{
    public class MarkerDto
    {
        public decimal PosX { get; set; }
        public decimal PosY { get; set; }
        public MapLayer MapLayerId { get; set; }
        [MaxLength(500)]
        public string? TitleText { get; set; }
        [MaxLength(500)]
        public string? DescriptionText { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        [MaxLength(100)]
        public string? ImageUrl { get; set; }
    }
}
