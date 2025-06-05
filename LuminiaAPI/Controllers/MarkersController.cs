using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Dtos.Markers;
using LuminiaAPI.Entities;
using LuminiaAPI.Enums;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetAllMarkers(bool showAll = false)
        {
            IQueryable<Marker> markers;

            if (showAll)
            {
                markers = _luminiaContext.Marker;
            }
            else
            {
                markers = _luminiaContext.Marker.Where(x => x.IsVisible == true);
            }

            if (markers == null)
            {
                return NotFound();
            }

            var markerDtos = markers.Select(x => _mapper.Map<MarkerDto>(x));

            return Ok(markerDtos);
        }

        [HttpGet("{mapLayerId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetMarkersByLayer(MapLayer mapLayerId)
        {
            var markers = _luminiaContext.Marker.Where(x => x.MapLayerId == mapLayerId && x.IsVisible == true);
            if (markers == null)
            {
                return NotFound();
            }

            var markerDtos = markers.Select(x => _mapper.Map<MarkerDto>(x));

            return Ok(markerDtos);
        }

        [HttpPatch("{markerId}/position")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PatchMarkerPositionByIdAsync(int markerId, decimal posX, decimal posY)
        {
            var marker = await _luminiaContext.Marker.FindAsync(markerId);

            if (marker == null)
            {
                return NotFound();
            }

            marker.PosX = posX;
            marker.PosY = posY; 

            await _luminiaContext.SaveChangesAsync();

            return Ok(marker);
        }
    }
}
