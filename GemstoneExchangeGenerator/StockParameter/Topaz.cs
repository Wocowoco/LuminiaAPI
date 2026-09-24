namespace GemstoneExchangeGenerator.StockParameter;

public static class Topaz
{
    public static StockParameters GetStockParametersForDay(int currentDay)
    {
        if ((currentDay / 364) % 5 == 0)
        {
            return StockPriceYearOfTopaz();
        }

        switch (currentDay % 364)
        {
            case <= 45: // Bloomen - 1st half
                return StockPriceNormal();
            case >= 46 and <= 90: // Bloomen - 2nd half
                return StockPriceNormal();
            case >= 91 and <= 135: // Sumsun - 1st half
                return StockPriceNormal();
            case >= 136 and <= 180: // Sumsun - 2nd half
                return StockPriceLow();
            case >= 181 and <= 225: // Leaflet - 1st half
                return StockPriceLow();
            case >= 226 and <= 270: // Leaflet - 2nd half
                return StockPriceLow();
            case >= 271 and <= 315: // Frizwa - 1st half
                return StockPriceLow();
            case >= 316 and <= 360: // Frizwa - 2nd half
                return StockPriceNormal();
            default:
                return StockPriceNormal();
        }
    }

    private static StockParameters StockPriceNormal()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 35;
        stockParameters.maxPrice = 65;
        stockParameters.volatility = 0.05;
        stockParameters.protectionDistanceMin = 50;
        stockParameters.protectionDistanceMax = 50;

        return stockParameters;
    }
    private static StockParameters StockPriceLow()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 30;
        stockParameters.maxPrice = 55;
        stockParameters.volatility = 0.05;
        stockParameters.protectionDistanceMin = 50;
        stockParameters.protectionDistanceMax = 50;

        return stockParameters;
    }

    private static StockParameters StockPriceYearOfTopaz()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 40;
        stockParameters.maxPrice = 85;
        stockParameters.volatility = 0.05;
        stockParameters.protectionDistanceMin = 100;
        stockParameters.protectionDistanceMax = 50;

        return stockParameters;
    }
}
