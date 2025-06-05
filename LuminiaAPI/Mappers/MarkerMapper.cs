using AutoMapper;
using LuminiaAPI.Dtos.Markers;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Mappers
{
    public class MarkerMapper
        : Profile
    {
        public MarkerMapper()
        {
            CreateMap<Marker, MarkerDto>().ReverseMap()
                .ForMember(x => x.AdminText, opt => opt.Ignore());
        }
    }
}
