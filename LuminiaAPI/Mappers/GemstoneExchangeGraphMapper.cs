using LuminiaAPI.Dtos.GemstoneExchange;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Mappers;

public static class GemstoneExchangeGraphMapper
{

    public static List<GemstoneGraphData> Map(IEnumerable<GemstoneExchange> gemstoneExchanges)
    {
        var graphData = new List<GemstoneGraphData>();

        foreach (var exchange in gemstoneExchanges)
        {
            // Check if gemstone already has a collection
            if (graphData.Any(x => x.Name == exchange.GemstoneId))
            {
                // Add to existing collection
                graphData.Single(x => x.Name == exchange.GemstoneId)
                    .Series.Add(new GemstoneGraphDataRow
                    {
                        Name = exchange.Day,
                        Value = exchange.Price
                    });
            }
            else // Add new collection and add the data to it
            {
                graphData.Add(new GemstoneGraphData
                {
                    Name = exchange.GemstoneId,
                    Series = new List<GemstoneGraphDataRow>
                    {
                        new GemstoneGraphDataRow
                        {
                            Name = exchange.Day,
                            Value = exchange.Price
                        }
                    }
                });
            }    
        }

        foreach (var gemstone in graphData)
        {
            gemstone.Series = gemstone.Series.OrderBy(x => x.Name).ToList();
        }

        return graphData;
    }
}
