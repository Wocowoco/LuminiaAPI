using System.ComponentModel.DataAnnotations.Schema;

namespace LuminiaAPI.Entities
{
    [Table("infernalalchemy", Schema = "luminia")]
    public class InfernalAlchemyStats
        : EntityBase
    {
        public int Budget { get; set; }
        public int ResearchPoints { get; set; }
        public int ResearchPointsTotal { get; set; }
    }
}
