using AutoMapper;
using LuminiaAPI.Context;
using LuminiaAPI.Dtos.Items;
using LuminiaAPI.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LuminiaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly ILuminiaContext _luminiaContext;
        private readonly IMapper _mapper;

        public ItemsController(ILuminiaContext luminiaContext, IMapper mapper)
        {
            _luminiaContext = luminiaContext;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IEnumerable<Item> GetAllItems()
        {
            return _luminiaContext.Items.Select(x => x);
        }


        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetItemById(int id)
        {
            var item = _luminiaContext.Items.SingleOrDefault(x => x.ObjectId == id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Post([FromBody] PostItemDto item)
        {
            var dbItem = _luminiaContext.Items.Add(_mapper.Map<Item>(item)).Entity;
            await _luminiaContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItemById), new {id = dbItem.ObjectId}, dbItem);
        }
    }
}
