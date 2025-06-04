using AutoMapper;
using LuminiaAPI.Dtos.Gemstone;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Mappers;

public class GemstoneExchangeMapper
    : Profile
{
    public GemstoneExchangeMapper()
    {
        CreateMap<GemstoneExchange, GemstoneExchangeDto>().ReverseMap();
    }
}
