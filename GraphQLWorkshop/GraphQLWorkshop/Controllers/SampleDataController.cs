using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GraphQLWorkshop.Data;
using Microsoft.AspNetCore.Mvc;

namespace GraphQLWorkshop.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts(int startDateIndex, 
            [FromServices] ApplicationDbContext dbContext)
        {
            Thread.Sleep(1000);

            var forecastBatch = dbContext.WeatherForecasts
                .OrderBy(wf => wf.Date)
                .Skip(startDateIndex)
                .Take(5);

            return forecastBatch;
        }

        [HttpPost("UpdateWeatherForecast")]
        public void UpdateWeatherForecast([FromBody] UpdateRequest request, 
            [FromServices] ApplicationDbContext dbContext)
        {
            var forecast = dbContext.WeatherForecasts.Single(f => f.Id == request.Id);
            forecast.Summary = request.Summary;
            dbContext.SaveChanges();
        }

        public class UpdateRequest
        {
            public int Id { get; set; }
            public string Summary { get; set; }
        }
    }
}
