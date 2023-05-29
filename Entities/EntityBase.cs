using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace LuminiaAPI.Entities
{
    public class EntityBase
    {
        [Key]
        public int ObjectId { get; set; }

        [MaxLength(45)]
        public string? CreationUser { get; set; }
        public DateTime? CreationDate { get; set; }

        [MaxLength(45)]
        public string? UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }

    }
}
