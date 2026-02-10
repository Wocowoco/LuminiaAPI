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
    public IActionResult GetAllGemstoneExchangesInGraphFormatForLastDays(int days, bool showAll = false)
    {
        List<GemstoneExchange> gemstoneExchanges;
        var latestDay = GetLatestDay(showAll);

        if (days != 0) // If day specified, go back x days
        {
            var startingDay = latestDay - days + 1;
            gemstoneExchanges = _luminiaContext.GemstoneExchange
                .Where(x => x.Day >= startingDay && x.Day <= latestDay)
                .ToList();
        }
        else // If no days specified (0), get all data
        {
            if (showAll) // DM - shows everything
            {
                gemstoneExchanges = _luminiaContext.GemstoneExchange.ToList();
            }
            else // For players - show everything until current day
            {
                gemstoneExchanges = _luminiaContext.GemstoneExchange.Where(x => x.Day <= latestDay).ToList();
            }
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
    public IActionResult GetGemstoneExchangesInGraphFormatForLastDays(Gemstone gemstoneId, int days, bool showAll = false)
    {
        List<GemstoneExchange> gemstoneExchanges;
        var latestDay = GetLatestDay(showAll);

        if (days != 0) // If day specified, go back x days
        {
            var startingDay = latestDay - days + 1;
            gemstoneExchanges = _luminiaContext.GemstoneExchange
                .Where(x => x.Day >= startingDay && 
                            x.Day <= latestDay &&
                            x.GemstoneId == gemstoneId)
                .ToList();
        }
        else // If no days specified (0), get all data for that Gemstone
        {
            if (showAll) // DM - shows everything
            {
                gemstoneExchanges = _luminiaContext.GemstoneExchange.Where(x => x.GemstoneId == gemstoneId).ToList();
            }
            else // For players - show everything until current day
            {
                gemstoneExchanges = _luminiaContext.GemstoneExchange.Where(x => x.GemstoneId == gemstoneId && x.Day <= latestDay).ToList();
            }
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
    public IActionResult GetAllGemstoneExchangesPriceHistory(bool showAll = false)
    {
        List<GemstoneExchange> gemstoneExchanges;
        int yesterday;
        int lastWeek;
        int lastQuarter;
        int lastYear;
        int lastFiveYears;
        int lastTenYears;

        var latestDay = GetLatestDay(showAll);

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

    private int GetLatestDay(bool showAll)
    {
        int latestDay;

        if (showAll) // Get latest day in gemstoneExchanges (for DM) 
        {
            latestDay = _luminiaContext.GemstoneExchange
                .OrderByDescending(x => x.Day)
                .Select(x => x.Day)
                .FirstOrDefault();
        }
        else // Get latest day in db (for players)
        {
            var currentday = _luminiaContext.CurrentDate.Single();
            latestDay = currentday.DayNumber;
        }

        return latestDay;
    }
}
