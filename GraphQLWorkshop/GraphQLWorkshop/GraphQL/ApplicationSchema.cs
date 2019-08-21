using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL;
using GraphQL.Types;
using GraphQLWorkshop.Data;

namespace GraphQLWorkshop.GraphQL
{
    public class ApplicationSchema : Schema
    {
        public ApplicationSchema(IDependencyResolver resolver) : base(resolver)
        {
            Query = resolver.Resolve<ApplicationQuery>();
        }
    }
    
    public class ApplicationQuery : ObjectGraphType
    {
        public ApplicationQuery()
        {
            Field<ListGraphType<WeatherForecastGraphType>, IEnumerable<WeatherForecast>>()
                .Name("weatherForecasts")
                .Argument<IntGraphType>("index", "The page index to fetch")
                .Resolve(graphQlContext =>
                {
                    var userContext = (ApplicationUserContext)graphQlContext.UserContext;
                    var dbContext = userContext.DbContext;
                    var index = graphQlContext.GetArgument<int>("index");

                    return dbContext.WeatherForecasts
                        .OrderBy(wf => wf.Date)
                        .Skip(Math.Max(index, 0))
                        .Take(5);
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

    public class ApplicationUserContext
    {
        public ApplicationDbContext DbContext { get; set; }
    }
}
