using System.ComponentModel.DataAnnotations;

namespace LuminiaAPI.Dtos.Gemstone;

public class GemstoneGraphData
{
    public required string Name { get; init; }
    public IList<GemstoneGraphDataRow> Series { get; set; }

    public GemstoneGraphData()
    {
        Series = new List<GemstoneGraphDataRow>();
    }
}
