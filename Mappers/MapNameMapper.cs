using AutoMapper;
using LuminiaAPI.Dtos.MapName;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Mappers;

public class MapNameMapper
    : Profile
{
    public MapNameMapper()
    {
        CreateMap<MapName, MapNameDto>().ReverseMap();
    }
}
