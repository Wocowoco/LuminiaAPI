using AutoMapper;
using LuminiaAPI.Dtos.CurrentDate;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Mappers
{
    public class CurrentDateMapper
        : Profile
    {
        public CurrentDateMapper()
        {
            CreateMap<CurrentDate, CurrentDateDto>().ReverseMap();
        }
    }
}
