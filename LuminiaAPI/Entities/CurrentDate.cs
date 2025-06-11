using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities
{
    [Table("currentdate", Schema = "luminia")]
    public class CurrentDate
        : EntityBase
    {
        public int Day { get; set; } // Depricated
        public int Year { get; set; } // Depricated
        public int DayNumber { get; set; }
    }
}
