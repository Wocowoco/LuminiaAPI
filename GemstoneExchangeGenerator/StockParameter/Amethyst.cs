namespace GemstoneExchangeGenerator.StockParameter;

public static class Amethyst
{
    public static StockParameters GetStockParametersForDay(int currentDay)
    {
        switch (currentDay % 364)
        {
            case <= 45: // Bloomen - 1st half
                return StockPriceNormal();
            case >= 46 and <= 90: // Bloomen - 2nd half
                return StockPriceNormal();
            case >= 91 and <= 135: // Sumsun - 1st half
                return StockPriceNormal();
            case >= 136 and <= 180: // Sumsun - 2nd half
                return StockPriceNormal();
            case >= 181 and <= 225: // Leaflet - 1st half
                return StockPriceHigh();
            case >= 226 and <= 270: // Leaflet - 2nd half
                return StockPriceNormal();
            case >= 271 and <= 315: // Frizwa - 1st half
                return StockPriceNormal();
            case >= 316 and <= 360: // Frizwa - 2nd half
                return StockPriceNormal();
            default:
                return StockPriceNormal();
        }
    }

    private static StockParameters StockPriceNormal()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 115;
        stockParameters.maxPrice = 200;
        stockParameters.volatility = 0.025;
        stockParameters.protectionDistanceMin = 75;
        stockParameters.protectionDistanceMax = 50;

        return stockParameters;
    }

    private static StockParameters StockPriceHigh()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 115;
        stockParameters.maxPrice = 250;
        stockParameters.volatility = 0.04;
        stockParameters.protectionDistanceMin = 175;
        stockParameters.protectionDistanceMax = 50;

        return stockParameters;
    }
}
