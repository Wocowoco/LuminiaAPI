using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities
{
    [Table("item", Schema = "luminia")]
    public class Item
        : EntityBase
    {
        [Required]
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Cost { get; set; }
        public string? Weight { get; set; }
        public string? Category { get; set; }
    }
}
