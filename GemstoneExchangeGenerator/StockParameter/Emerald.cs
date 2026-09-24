namespace GemstoneExchangeGenerator.StockParameter;
public static class Emerald
{
    public static StockParameters GetStockParametersForDay(int currentDay)
    {
        switch (currentDay % 364)
        {
            case <= 45: // Bloomen - 1st half
                return StockPriceHigh();
            case >= 46 and <= 90: // Bloomen - 2nd half
                return StockPriceNormal();
            case >= 91 and <= 135: // Sumsun - 1st half
                return StockPriceNormal();
            case >= 136 and <= 180: // Sumsun - 2nd half
                return StockPriceNormal();
            case >= 181 and <= 225: // Leaflet - 1st half
                return StockPriceNormal();
            case >= 226 and <= 270: // Leaflet - 2nd half
                return StockPriceNormal();
            case >= 271 and <= 315: // Frizwa - 1st half
                return StockPriceNormal();
            case >= 316 and <= 360: // Frizwa - 2nd half
                return StockPriceHigh();
            default:
                return StockPriceNormal();
        }
    }

    private static StockParameters StockPriceNormal()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 60;
        stockParameters.maxPrice = 110;
        stockParameters.volatility = 0.03;
        stockParameters.protectionDistanceMin = 30;
        stockParameters.protectionDistanceMax = 30;

        return stockParameters;
    }

    private static StockParameters StockPriceHigh()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 60;
        stockParameters.maxPrice = 130;
        stockParameters.volatility = 0.05;
        stockParameters.protectionDistanceMin = 100;
        stockParameters.protectionDistanceMax = 30;

        return stockParameters;
    }
}
