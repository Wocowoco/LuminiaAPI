namespace GemstoneExchangeGenerator.StockParameter;

public static class Citrine
{
    public static StockParameters GetStockParametersForDay(int currentDay)
    {
        if (currentDay <= 2674000)
        {
            return StockPriceFreeMoving();
        }
        else
        { 
            return StockPriceDeclining();
        }
    }

    private static StockParameters StockPriceFreeMoving()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 5;
        stockParameters.maxPrice = 100;
        stockParameters.volatility = 0.1;
        stockParameters.protectionDistanceMin = 100;
        stockParameters.protectionDistanceMax = 25;

        return stockParameters;
    }

    private static StockParameters StockPriceDeclining()
    {
        var stockParameters = new StockParameters();

        stockParameters.minPrice = 5;
        stockParameters.maxPrice = 50;
        stockParameters.volatility = 0.1;
        stockParameters.protectionDistanceMin = 25;
        stockParameters.protectionDistanceMax = 100;

        return stockParameters;
    }
}
