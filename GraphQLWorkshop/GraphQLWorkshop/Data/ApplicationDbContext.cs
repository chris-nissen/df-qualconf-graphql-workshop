using GraphQLWorkshop.Controllers;
using Microsoft.EntityFrameworkCore;

namespace GraphQLWorkshop.Data
{
    public class ApplicationDbContext : DbContext
    {
        public virtual DbSet<WeatherForecast> WeatherForecasts { get; set; }

        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
