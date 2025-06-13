using AutoMapper;
using LuminiaAPI.Dtos.GemstoneExchange;
using LuminiaAPI.Entities;
using LuminiaAPI.Enums;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LuminiaAPI.Handlers.GemstoneExchangeHandlers;

public interface ICreateGemstoneExchangesHandler
{
    public IList<GemstoneExchange> Handle(IReadOnlyList<GemstoneExchange> oldExchanges); 
}

public class CreateGemstoneExchangesHandler
    : ICreateGemstoneExchangesHandler
{
    public IList<GemstoneExchange> Handle(IReadOnlyList<GemstoneExchange> oldExchanges)
    {
        var newExchanges = new List<GemstoneExchange>();

        // Get settings
        var filePath = Path.Combine(AppContext.BaseDirectory, "GemstoneExchangeSettings.json");
        var jsonText = File.ReadAllText(filePath);

        GemstoneExchangeSettings settings = JsonSerializer.Deserialize<GemstoneExchangeSettings>(jsonText, new JsonSerializerOptions {
            PropertyNameCaseInsensitive = true,
            Converters = {new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)}
        }) ?? throw new Exception();

        foreach (var gemstone in oldExchanges)
        {
            gemstone.ObjectId = 0;

            // Increase day by one
            gemstone.Day++;

            var gemstoneSpecificSettings = settings.GemstoneSettings.Single(x => x.gemstoneId == gemstone.GemstoneId);
            gemstone.Price = CalculateNewPrice(gemstone.Price, gemstoneSpecificSettings);

            newExchanges.Add(gemstone);
        }

        return newExchanges;
    }

    private double CalculateNewPrice(double oldPrice, GemstoneSettings gemstoneSettings)
    {
        double price = oldPrice;
        double minPrice = gemstoneSettings.minPrice;
        double maxPrice = gemstoneSettings.maxPrice;
        double volatility = gemstoneSettings.volatility;
        double protectionDistanceMin = gemstoneSettings.protectionDistanceMin;
        double protectionDistanceMax = gemstoneSettings.protectionDistanceMax;

        double protectionFactor = 0;

        // Generate next number for the stock
        var rng = new Random();

        // Generate base random value between -1 and 1
        double direction = (rng.NextDouble() * 2.0) - 1.0;

        // Bias the downward direction to be smaller near minPrice
        if (direction < 0)
        {
            protectionFactor = Math.Pow(Math.Max(0, price - minPrice) / protectionDistanceMin, 0.3);
            protectionFactor = Math.Clamp(protectionFactor, 0.1, 1.0);
            direction *= protectionFactor;
        }
        // Bias the upward direction to be smaller near maxPrice
        else
        {
            protectionFactor = Math.Pow(Math.Max(0, maxPrice - price) / protectionDistanceMax, 0.3);
            protectionFactor = Math.Clamp(protectionFactor, 0.1, 1.0);
            direction *= protectionFactor;
        }

        // Scale by volatility
        double change = price * direction * volatility;

        // Ensure the price does not go below a set value
        price = Math.Round(Math.Max(minPrice, price + change), 1);

        return price;
    }
}
