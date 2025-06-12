using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Dtos.GemstoneExchange;
using LuminiaAPI.Entities;
using LuminiaAPI.Enums;
using LuminiaAPI.Handlers.GemstoneExchangeHandlers;
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
    private readonly ICreateGemstoneExchangesHandler _createGemstoneExchangesHandler;

    public GemstoneExchangesController(ILuminiaContext luminiaContext, IMapper mapper, ICreateGemstoneExchangesHandler createGemstoneExchangesHandler)
    {
        _luminiaContext = luminiaContext;
        _mapper = mapper;
        _createGemstoneExchangesHandler = createGemstoneExchangesHandler;
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
        var dbitems = gemstoneExchangeDtos.Select(x => _mapper.Map<GemstoneExchange>(x)).ToList();
        _luminiaContext.GemstoneExchange.AddRange(dbitems);
        await _luminiaContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllGemstoneExchanges), dbitems);
    }

    [HttpPost("{dayNumber}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateGemstoneExchangesForDay(int dayNumber)
    {
        var oldExchanges = _luminiaContext.GemstoneExchange.Where(x => x.Day == (dayNumber - 1)).ToList();

        var newExchanges = _createGemstoneExchangesHandler.Handle(oldExchanges);

        _luminiaContext.GemstoneExchange.AddRange(newExchanges);
        await _luminiaContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllGemstoneExchanges), newExchanges);
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

            var startingDay = latestDay - days + 1;
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

    [HttpGet("graph/{gemstoneId}/{days}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetGemstoneExchangesInGraphFormatForLastDays(Gemstone gemstoneId, int days)
    {
        List<GemstoneExchange> gemstoneExchanges;
        if (days != 0) // If day specified, go back x days
        {
            // Get latest day in db
            var latestDay = _luminiaContext.GemstoneExchange
                .OrderByDescending(x => x.Day)
                .Select(x => x.Day)
                .FirstOrDefault();

            var startingDay = latestDay - days + 1;
            gemstoneExchanges = _luminiaContext.GemstoneExchange
                .Where(x => x.Day >= startingDay && x.GemstoneId == gemstoneId)
                .ToList();
        }
        else // If no days specified (0), get all data for that Gemstone
        {
            gemstoneExchanges = _luminiaContext.GemstoneExchange.Where(x => x.GemstoneId == gemstoneId).ToList();
        }

        if (gemstoneExchanges == null || gemstoneExchanges.Count == 0)
        {
            return NotFound();
        }

        var graphData = GemstoneExchangeGraphMapper.Map(gemstoneExchanges);

        return Ok(graphData);
    }

    [HttpGet("history")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetAllGemstoneExchangesPriceHistory()
    {
        List<GemstoneExchange> gemstoneExchanges;
        int yesterday;
        int lastWeek;
        int lastQuarter;
        int lastYear;
        int lastFiveYears;
        int lastTenYears;

        // Get latest day in db
        var latestDay = _luminiaContext.GemstoneExchange
            .OrderByDescending(x => x.Day)
            .Select(x => x.Day)
            .FirstOrDefault();

        yesterday = latestDay - 1;
        lastWeek = latestDay - 7;
        lastQuarter = latestDay - 91;
        lastYear = latestDay - 364;
        lastFiveYears = latestDay - 1820;
        lastTenYears = latestDay - 3640;

        var dayList = new List<int> { latestDay, yesterday, lastWeek, lastQuarter, lastYear, lastFiveYears, lastTenYears };

        gemstoneExchanges = _luminiaContext.GemstoneExchange
                                .Where(x => dayList.Contains(x.Day))
                                .ToList();

        var priceHistory = GemstoneExchangeGraphMapper.Map(gemstoneExchanges);

        return Ok(priceHistory);
    }
}
