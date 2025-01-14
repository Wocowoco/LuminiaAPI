using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Dtos.InfernalAlchemy;
using Microsoft.AspNetCore.Mvc;

namespace LuminiaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InfernalAlchemyController
        : ControllerBase
    {
        private readonly ILuminiaContext _luminiaContext;
        private readonly IMapper _mapper;

        public InfernalAlchemyController(ILuminiaContext luminiaContext, IMapper mapper )
        {
            _luminiaContext = luminiaContext;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetInfernalAlchemyStats()
        {
            var infernalAlchemyStats = _luminiaContext.InfernalAlchemyStats.Single();
            var infernalAlchemyStatsDto = _mapper.Map<InfernalAlchemyStatsDto>(infernalAlchemyStats);

            return Ok(infernalAlchemyStatsDto);
        }
    }
}
