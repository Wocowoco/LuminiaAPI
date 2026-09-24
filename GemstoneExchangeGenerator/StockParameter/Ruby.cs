namespace GemstoneExchangeGenerator.StockParameter;
public static class Ruby
{
    public static StockParameters GetStockParametersForDay(int currentDay)
    {
        switch (currentDay % 364)
        {
            case <= 45: // Bloomen - 1st half
                return StockPriceNormal();
            case >= 46 and <= 90: // Bloomen - 2nd half
                return StockPriceHigh();
            case >= 91 and <= 135: // Sumsun - 1st half
                return StockPricePeak();
            case >= 136 and <= 180: // Sumsun - 2nd half
                return StockPriceHigh();
            case >= 181 and <= 225: // Leaflet - 1st half
                return StockPriceNormal();
            case >= 226 and <= 270: // Leaflet - 2nd half
                return StockPriceNormal();
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

        stockParameters.minPrice = 50;
        stockParameters.maxPrice = 100;
        stockParameters.volatility = 0.02;
        stockParameters.protectionDistanceMin = 30;
        stockParameters.protectionDistanceMax = 30;

        return stockParameters;
    }

    private static StockParameters StockPriceHigh()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 50;
        stockParameters.maxPrice = 120;
        stockParameters.volatility = 0.04;
        stockParameters.protectionDistanceMin = 300;
        stockParameters.protectionDistanceMax = 30;

        return stockParameters;
    }

    private static StockParameters StockPricePeak()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 50;
        stockParameters.maxPrice = 150;
        stockParameters.volatility = 0.05;
        stockParameters.protectionDistanceMin = 400;
        stockParameters.protectionDistanceMax = 30;

        return stockParameters;
    }

    private static StockParameters StockPriceLow()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 50;
        stockParameters.maxPrice = 80;
        stockParameters.volatility = 0.03;
        stockParameters.protectionDistanceMin = 30;
        stockParameters.protectionDistanceMax = 300;

        return stockParameters;
    }
}
