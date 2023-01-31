using LuminiaAPI.Context;
using LuminiaAPI.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LuminiaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly ILuminiaContext _luminiaContext;

        public ItemsController(ILuminiaContext luminiaContext)
        {
            _luminiaContext = luminiaContext;
        }

        [HttpGet]
        public IEnumerable<Item> GetAllItems()
        {
            return _luminiaContext.Items.Select(x => x);
        }

        [HttpGet("{id}")]
        public IActionResult GetItemById(int id)
        {
            var item = _luminiaContext.Items.SingleOrDefault(x => x.ObjectId == id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }
    }
}
