using AutoMapper;
using LuminiaAPI.Dtos.InfernalAlchemy;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Mappers
{
    public class InfernalAlchemyMapper
        : Profile
    {
        public InfernalAlchemyMapper()
        {
            CreateMap<InfernalAlchemyStats, InfernalAlchemyStatsDto>().ReverseMap();
        }
    }
}
