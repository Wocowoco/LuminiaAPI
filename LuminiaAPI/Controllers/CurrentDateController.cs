using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Dtos.CurrentDate;
using Microsoft.AspNetCore.Mvc;

namespace LuminiaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrentDateController
        : ControllerBase
    {
        private readonly ILuminiaContext _luminiaContext;
        private readonly IMapper _mapper;

        public CurrentDateController(ILuminiaContext luminiaContext, IMapper mapper)
        {
            _luminiaContext = luminiaContext;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetCurrentDate()
        {
            var currentDate = _luminiaContext.CurrentDate.Single();
            var currentDateDto = _mapper.Map<CurrentDateDto>(currentDate);

            return Ok(currentDateDto);
        }

        [HttpPatch]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCurrentDateAsync(int dayNumber)
        {
            var currentDate = _luminiaContext.CurrentDate.SingleOrDefault();

            if (currentDate == null)
            {
                return NotFound();
            }

            currentDate.DayNumber = dayNumber;
            await _luminiaContext.SaveChangesAsync();

            var currentDateDto = _mapper.Map<CurrentDateDto>(currentDate);

            return Ok(currentDateDto);
        }
    }
}
