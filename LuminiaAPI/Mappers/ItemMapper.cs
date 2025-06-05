using AutoMapper;
using LuminiaAPI.Dtos.Items;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Mappers
{
    public class ItemMapper 
        : Profile
    {
        public ItemMapper()
        {
            CreateMap<Item, PostItemDto>().ReverseMap();
        }
    }
}
