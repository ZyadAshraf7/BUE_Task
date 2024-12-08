using Microsoft.EntityFrameworkCore;
using RegistirationModule.API.Models;
using System.Reflection.Emit;

namespace RegistirationModule.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

        }
        public DbSet<Registiration> Registirations { get; set; }
    }
}
