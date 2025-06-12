using LuminiaAPI.Enums;

namespace LuminiaAPI.Dtos.GemstoneExchange;

public class GemstoneExchangeSettings
{
    public IList<GemstoneSettings> GemstoneSettings { get; set; }
    public GemstoneExchangeSettings()
    {
        GemstoneSettings = new List<GemstoneSettings>();
    }
}

public class GemstoneSettings()
{
    public Gemstone gemstoneId { get; set; }
    public double minPrice { get; set; }
    public double maxPrice { get; set; }
    public double volatility { get; set; }
    public double protectionDistanceMin { get; set; }
    public double protectionDistanceMax { get; set; }
}
