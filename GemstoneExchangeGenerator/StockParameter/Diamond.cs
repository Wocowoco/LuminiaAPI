namespace GemstoneExchangeGenerator.StockParameter;

public static class Diamond
{
    public static StockParameters GetStockParametersForDay(int currentDay)
    {
        return StockPriceNormal();
    }

    private static StockParameters StockPriceNormal()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 260;
        stockParameters.maxPrice = 340;
        stockParameters.volatility = 0.05;
        stockParameters.protectionDistanceMin = 500;
        stockParameters.protectionDistanceMax = 500;

        return stockParameters;
    }
}
