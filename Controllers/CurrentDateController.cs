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
    }
}
