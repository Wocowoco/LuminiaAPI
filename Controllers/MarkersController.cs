using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Enums;
using LuminiaAPI.Entities;
using Microsoft.AspNetCore.Mvc;
using LuminiaAPI.Dtos.Markers;

namespace LuminiaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarkersController 
        : ControllerBase
    {
        private readonly ILuminiaContext _luminiaContext;
        private readonly IMapper _mapper;

        public MarkersController(ILuminiaContext luminiaContext, IMapper mapper)
        {
            _luminiaContext = luminiaContext;
            _mapper = mapper;
        }

        [HttpGet("{mapLayerId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetMarkersByLayer(MapLayer mapLayerId)
        {
            var markers = _luminiaContext.Marker.Where(x => x.MapLayerId == mapLayerId);
            if (markers == null)
            {
                return NotFound();
            }

            var markerDtos = markers.Select(x => _mapper.Map<MarkerDto>(x));

            return Ok(markerDtos);
        }
    }
}
