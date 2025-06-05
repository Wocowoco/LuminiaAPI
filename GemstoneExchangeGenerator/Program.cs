using LuminiaAPI.Dtos.GemstoneExchange;
using LuminiaAPI.Enums;
using System.Text.Json;

Gemstone gemstoneId = 0;
int startDay = 0;
int amountOfDays = 0;
double startingPrice = 0;

while (true)
{
    Console.WriteLine("Which gemstone to generate?");
    string gemstoneText = Console.ReadLine();

    // Check if the input is valid
    if (Enum.TryParse(gemstoneText, out gemstoneId))
    {
        break;
    }
    else
    {
        Console.WriteLine("Invalid gemstone. Please try again.");
        continue;
    }
}

while (true)
{
    Console.WriteLine("Enter starting day (inclusive):");
    string startDayText = Console.ReadLine();

    // Check if the input is valid
    if (int.TryParse(startDayText, out startDay))
    {
        break;
    }
    else
    {
        Console.WriteLine("Invalid number. Please try again.");
        continue;
    }
}
while (true)
{
    Console.WriteLine("Enter amount of days to generate:");
    string amountOfDaysText = Console.ReadLine();

    // Check if the input is valid
    if (int.TryParse(amountOfDaysText, out amountOfDays))
    {
        break;
    }
    else
    {
        Console.WriteLine("Invalid number. Please try again.");
        continue;
    }
}
while (true)
{
    Console.WriteLine("Enter starting price:");
    string startingPriceText = Console.ReadLine();

    // Check if the input is valid
    if (double.TryParse(startingPriceText, out startingPrice))
    {
        break;
    }
    else
    {
        Console.WriteLine("Invalid number. Please try again.");
        continue;
    }
}

Console.WriteLine("Generating " + gemstoneId.ToString() + " data, starting from " + startDay + " for a total of " + amountOfDays + " days. Starting at a price of " + startingPrice + ".");

while (true)
{
    double price = startingPrice;
    double minPrice = 33;
    double maxPrice = 213;
    double lowest = startingPrice;
    double highest = startingPrice;
    double protectionFactor = 0;
    double protectionDistance = 50;

    var GemstoneExchangeList = new List<GemstoneExchangeDto>();

    for (int i = 0; i < amountOfDays; i++)
    {
        //Generate next number for the stock
        var rng = new Random();

        // Volatility factor controls how much it can move
        double volatility = 0.05;

        // Generate base random value between -1 and 1
        double direction = (rng.NextDouble() * 2.0) - 1.0;

        // Bias the downward direction to be smaller near minPrice
        if (direction < 0)
        {
            protectionFactor = Math.Pow(Math.Max(0, price - minPrice) / protectionDistance, 0.3);
            protectionFactor = Math.Clamp(protectionFactor, 0.1, 1.0);
            direction *= protectionFactor;
        }
        // Bias the upward direction to be smaller near maxPrice
        else
        {
            protectionFactor = Math.Pow(Math.Max(0, maxPrice - price) / protectionDistance, 0.3);
            protectionFactor = Math.Clamp(protectionFactor, 0.1, 1.0);
            direction *= protectionFactor;
        }

        // Scale by volatility
        double change = price * direction * volatility;

        // Ensure the price does not go below a set value
        price = Math.Round(Math.Max(minPrice, price + change), 1);

        //Check highest and lowest
        lowest = Math.Min(lowest, price);
        highest = Math.Max(highest, price);

        Console.Write("Price: " + price);
        switch (change)
        {
            case < 0:
                Console.ForegroundColor = ConsoleColor.Red;
                break;
            case > 0:
                Console.ForegroundColor = ConsoleColor.Green;
                break;
            default:
                break;
        }

        Console.WriteLine(" (Change: " + change + ", protection: " + protectionFactor + ")");
        Console.ResetColor();
        GemstoneExchangeList.Add(new GemstoneExchangeDto
        {
            GemstoneId = gemstoneId,
            Day = startDay + i,
            Price = price
        });
    }

    var json = JsonSerializer.Serialize(GemstoneExchangeList);
    Console.WriteLine("Lowest price: " + lowest);
    Console.WriteLine("Highest price: " + highest);
    Console.ReadLine();
}