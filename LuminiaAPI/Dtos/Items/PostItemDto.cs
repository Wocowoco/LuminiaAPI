using System.ComponentModel.DataAnnotations;

namespace LuminiaAPI.Dtos.Items
{
    public class PostItemDto
    {
        [Required]
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Cost { get; set; }
        public string? Weight { get; set; }
        public string? Category { get; set; }
    }
}
