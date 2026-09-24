namespace GemstoneExchangeGenerator.StockParameter;

public static class Onyx
{
    public static StockParameters GetStockParametersForDay(int currentDay)
    {
        var stockParameters = new StockParameters();
        var priceIncrease = (currentDay - 2668992) / 30; // 2668992 is the start of the Gemstone exchange
        stockParameters.minPrice = Math.Max(90, priceIncrease);
        stockParameters.maxPrice = Math.Max(110, priceIncrease + 40);
        stockParameters.volatility = 0.015;
        stockParameters.protectionDistanceMin = 250;
        stockParameters.protectionDistanceMax = 250;

        return stockParameters;
    }
}
