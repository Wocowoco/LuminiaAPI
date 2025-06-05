using LuminiaAPI.Enums;

namespace LuminiaAPI.Dtos.GemstoneExchange;

public class GemstoneExchangeDto
{
    public Gemstone GemstoneId { get; set; }
    public int Day { get; set; }
    public double Price { get; set; }
}
