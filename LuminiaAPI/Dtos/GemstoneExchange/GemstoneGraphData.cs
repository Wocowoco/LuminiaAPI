using LuminiaAPI.Enums;

namespace LuminiaAPI.Dtos.GemstoneExchange;

public class GemstoneGraphData
{
    public required Gemstone Name { get; init; }
    public IList<GemstoneGraphDataRow> Series { get; set; }

    public GemstoneGraphData()
    {
        Series = new List<GemstoneGraphDataRow>();
    }
}
