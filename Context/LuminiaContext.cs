﻿using LuminiaAPI.Entities;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace LuminiaAPI.Context
{
    public interface ILuminiaContext
    {
        public DbSet<Item> Items { get; set; }
        public DbSet<Marker> Marker { get; set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }

    public class LuminiaContext 
        : DbContext, ILuminiaContext
    {
        private const string LUMINIADB = "LuminiaDb";

        public LuminiaContext(DbContextOptions options)
            : base(options)
        {
        }   

        public DbSet<Item> Items { get; set; }
        public DbSet<Marker> Marker { get; set; }



        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {

            //Get all entities that are being added or modified
            var allEntries  = ChangeTracker.Entries().Where(e => e.Entity is EntityBase && (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in allEntries)
            {
                if (entry.State == EntityState.Added)
                {
                    ((EntityBase)entry.Entity).CreationDate = DateTime.Now;
                    ((EntityBase)entry.Entity).CreationUser = LUMINIADB;
                }
                else if (entry.State == EntityState.Modified)
                {
                    ((EntityBase)entry.Entity).UpdateDate = DateTime.Now;
                    ((EntityBase)entry.Entity).CreationUser = LUMINIADB;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }

}
