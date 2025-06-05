using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Dtos.GemstoneExchange;
using LuminiaAPI.Entities;
using LuminiaAPI.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace LuminiaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GemstoneExchangesController
    : ControllerBase
{
    private readonly ILuminiaContext _luminiaContext;
    private readonly IMapper _mapper;

    public GemstoneExchangesController(ILuminiaContext luminiaContext, IMapper mapper)
    {
        _luminiaContext = luminiaContext;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetAllGemstoneExchanges()
    {
        var gemstoneExchanges = _luminiaContext.GemstoneExchange.ToList();
        if (gemstoneExchanges == null || gemstoneExchanges.Count == 0)
        {
            return NotFound();
        }
        var gemstoneExchangeDtos = gemstoneExchanges.Select(x => _mapper.Map<GemstoneExchangeDto>(x));

        return Ok(gemstoneExchangeDtos);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PostGemstoneExchanges([FromBody] GemstoneExchangeDto[] gemstoneExchangeDtos)
    {
        var dbitems = gemstoneExchangeDtos.Select(x => _mapper.Map<Entities.GemstoneExchange>(x)).ToList();
        _luminiaContext.GemstoneExchange.AddRange(dbitems);
        await _luminiaContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllGemstoneExchanges), dbitems);
    }

    [HttpGet("graph")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetAllGemstoneExchangesInGraphFormat()
    {
        var gemstoneExchanges = _luminiaContext.GemstoneExchange.ToList();
        if (gemstoneExchanges == null || gemstoneExchanges.Count == 0)
        {
            return NotFound();
        }

        var graphData = GemstoneExchangeGraphMapper.Map(gemstoneExchanges);

        return Ok(graphData);
    }

    [HttpGet("graph/{days}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetAllGemstoneExchangesInGraphFormatForLastDays(int days)
    {
        List<GemstoneExchange> gemstoneExchanges;
        if (days != 0) // If day specified, go back x days
        {
            // Get latest day in db
            var latestDay = _luminiaContext.GemstoneExchange
                .OrderByDescending(x => x.Day)
                .Select(x => x.Day)
                .FirstOrDefault();

            var startingDay = latestDay - days;
            gemstoneExchanges = _luminiaContext.GemstoneExchange
                .Where(x => x.Day >= startingDay)
                .ToList();
        }
        else // If no days specified (0), get all data
        {
            gemstoneExchanges = _luminiaContext.GemstoneExchange.ToList();
        }

        if (gemstoneExchanges == null || gemstoneExchanges.Count == 0)
        {
            return NotFound();
        }

        var graphData = GemstoneExchangeGraphMapper.Map(gemstoneExchanges);

        return Ok(graphData);
    }
}
