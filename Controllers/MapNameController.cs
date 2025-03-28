using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Dtos.MapName;
using Microsoft.AspNetCore.Mvc;

namespace LuminiaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapNamesController
    : ControllerBase
{
    private readonly ILuminiaContext _luminiaContext;
    private readonly IMapper _mapper;

    public MapNamesController(ILuminiaContext luminiaContext, IMapper mapper)
    {
        _luminiaContext = luminiaContext;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetAllMapNames()
    {
        var mapNames = _luminiaContext.MapName;

        if (mapNames == null)
        {
            return NotFound();
        }

        var mapNameDtos = mapNames.Select(x => _mapper.Map<MapNameDto>(x));

        return Ok(mapNameDtos);
    }

    [HttpGet("{mapName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetNameOfFolderByMapName(string mapName)
    {
        var mapNameDb = _luminiaContext.MapName.SingleOrDefault(x => x.NameOfMap == mapName);

        if (mapNameDb == null)
        {
            return NotFound();
        }

        var mapNameDto = _mapper.Map<MapNameDto>(mapNameDb);

        return Ok(mapNameDto);
    }

    [HttpPatch("{mapName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateNameOfFolderByMapName(string mapName, string updatedFolderName)
    {
        var mapNameDb = _luminiaContext.MapName.SingleOrDefault(x => x.NameOfMap == mapName);

        if (mapNameDb == null)
        {
            return NotFound();
        }

        mapNameDb.NameOfFolder = updatedFolderName;
        await _luminiaContext.SaveChangesAsync();

        var mapNameDto = _mapper.Map<MapNameDto>(mapNameDb);

        return Ok(mapNameDto);
    }
}
