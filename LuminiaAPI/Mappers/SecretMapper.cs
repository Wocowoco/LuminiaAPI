using AutoMapper;
using LuminiaAPI.Dtos.Secrets;
using LuminiaAPI.Entities;

namespace LuminiaAPI.Mappers;

public class SecretMapper
    : Profile
{
    public SecretMapper()
    {
        CreateMap<Secret, SecretDto>();
    }
}
