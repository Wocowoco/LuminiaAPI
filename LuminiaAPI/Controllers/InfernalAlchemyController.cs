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

        /// <summary>Ids of the unlocked Alchemical Research Tree nodes, in the order they were unlocked.</summary>
        [HttpGet("research-unlocks")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetResearchUnlocks()
        {
            var nodeIds = _luminiaContext.ResearchUnlock
                .OrderBy(u => u.ObjectId)
                .Select(u => u.NodeId)
                .ToList();

            return Ok(nodeIds);
        }

        /// <summary>Replaces the unlocked research nodes with the given node ids.</summary>
        [HttpPut("research-unlocks")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateResearchUnlocksAsync([FromBody] string[] nodeIds)
        {
            var wanted = nodeIds.Select(id => id?.Trim() ?? "").Distinct().ToList();
            if (wanted.Any(id => id.Length == 0 || id.Length > 64))
            {
                return BadRequest("Node ids must be 1-64 characters long.");
            }

            var existing = _luminiaContext.ResearchUnlock.ToList();
            _luminiaContext.ResearchUnlock.RemoveRange(existing.Where(u => !wanted.Contains(u.NodeId)));
            var existingIds = existing.Select(u => u.NodeId).ToHashSet();
            _luminiaContext.ResearchUnlock.AddRange(wanted
                .Where(id => !existingIds.Contains(id))
                .Select(id => new Entities.ResearchUnlock { NodeId = id }));
            await _luminiaContext.SaveChangesAsync();

            return GetResearchUnlocks();
        }
    }
}
