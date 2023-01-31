using LuminiaAPI.Entities;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace LuminiaAPI.Context
{
    public interface ILuminiaContext
    {
        public DbSet<Item> Items { get; set; }
    }

    public class LuminiaContext 
        : DbContext, ILuminiaContext
    {
        public LuminiaContext(DbContextOptions options)
            : base(options)
        {
        }   

        public DbSet<Item> Items { get; set; }
    }

}
