using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL;
using GraphQL.Language.AST;
using GraphQL.Types;
using GraphQLWorkshop.Data;

namespace GraphQLWorkshop.GraphQL
{
    public class ApplicationSchema : Schema
    {
        public ApplicationSchema(IDependencyResolver resolver) : base(resolver)
        {
            Query = resolver.Resolve<Query>();
            Mutation = resolver.Resolve<Mutation>();
        }
    }
    
    public class Query : ObjectGraphType
    {
        public Query()
        {
            Field<ListGraphType<WeatherForecastGraphType>, IEnumerable<WeatherForecast>>()
                .Name("weatherForecasts")
                .Argument<IntGraphType>("index", "The page index to fetch")
                .Resolve(context =>
                {
                    var userContext = (GraphQLUserContext)context.UserContext;
                    var dbContext = userContext.DbContext;
                    var index = context.GetArgument<int>("index");

                    return dbContext.WeatherForecasts
                        .OrderBy(wf => wf.Date)
                        .Skip(Math.Max(index, 0))
                        .Take(5);
                });
        }
    }
    
    public class Mutation : ObjectGraphType
    {
        public Mutation()
        {
            Field<MutateWeatherForecastGraphType>()
                .Name("weatherForecasts")
                .Resolve(context => new { });
        }
    }

    public class MutateWeatherForecastGraphType : ObjectGraphType
    {
        public MutateWeatherForecastGraphType()
        {
            Field<WeatherForecastGraphType>()
                .Name("updateSummary")
                .Argument<IntGraphType>("id", "The database ID of the forecast")
                .Argument<StringGraphType>("summary", "The new forecast summary")
                .Resolve(context =>
                {
                    var forecastId = context.GetArgument<int>("id");
                    var newSummary = context.GetArgument<string>("summary");
                    var dbContext = ((GraphQLUserContext) context.UserContext).DbContext;

                    var forecast = dbContext.WeatherForecasts.Single(f => f.Id == forecastId);
                    forecast.Summary = newSummary;

                    dbContext.SaveChanges();

                    return forecast;
                });
        }
    }

    public class WeatherForecastGraphType : ObjectGraphType<WeatherForecast>
    {
        public WeatherForecastGraphType()
        {
            Name = "WeatherForecast";
            Field(wf => wf.Id);
            Field(wf => wf.Date);
            Field(wf => wf.DateFormatted);
            Field(wf => wf.TemperatureC);
            Field(wf => wf.TemperatureF);
            Field(wf => wf.Summary);
        }
    }

    public class GraphQLUserContext
    {
        public ApplicationDbContext DbContext { get; set; }
    }
}
