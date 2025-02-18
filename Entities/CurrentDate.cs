using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities
{
    [Table("currentdate", Schema = "luminia")]
    public class CurrentDate
        : EntityBase
    {
        public int Day { get; set; }
        public int Year { get; set; }
    }
}
