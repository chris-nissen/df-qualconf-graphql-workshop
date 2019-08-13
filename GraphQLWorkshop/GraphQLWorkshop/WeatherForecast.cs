using System;
using System.ComponentModel.DataAnnotations;

namespace GraphQLWorkshop
{
    public class WeatherForecast
    {
        public static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string DateFormatted => Date.ToString("d");
        public int TemperatureC { get; set; }

        [Required]
        public string Summary { get; set; }

        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
    }
}