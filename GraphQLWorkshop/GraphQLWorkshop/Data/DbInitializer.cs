using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GraphQLWorkshop.Data
{
    public interface IDbInitializer
    {
        Task Initialize();
    }

    public class DbInitializer : IDbInitializer
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public DbInitializer(IServiceProvider serviceProvider)
        {
            _context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            _configuration = serviceProvider.GetRequiredService<IConfiguration>();
        }

        public async Task Initialize()
        {
            _context.Database.Migrate();

            await ResetData();
            await AddForecasts();
        }

        private async Task ResetData()
        {
            await _context.Database.ExecuteSqlCommandAsync(@"
delete from WeatherForecasts;
");
        }

        private async Task AddForecasts()
        {
            var rng = new Random();
            var forecasts = Enumerable.Range(1, 100).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = WeatherForecast.Summaries[rng.Next(WeatherForecast.Summaries.Length)]
            });

            _context.WeatherForecasts.AddRange(forecasts);

            await _context.SaveChangesAsync();
        }
    }
}