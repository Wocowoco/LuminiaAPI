using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace LuminiaAPI.Entities
{
    public class EntityBase
    {
        [Key]
        public int ObjectId { get; set; }

        public string? CreationUser { get; set; }
        public DateTime CreationDate { get; set; }

        public string? UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }

    }
}
