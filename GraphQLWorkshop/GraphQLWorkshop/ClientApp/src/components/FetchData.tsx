import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Input, Alert } from 'reactstrap';
import _ from 'lodash';
import { Forecast } from 'models';
import gql from 'graphql-tag';
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks';

type Props = RouteComponentProps<{ startDateIndex: string }>;

const GetForecasts = gql`
        query GetForecasts($startIndex: Int!) {
            weatherForecasts(skip: $startIndex, take: 5, orderBy: { path: "Date" },
				where: {
				    path: "temperatureC",
				    comparison: "greaterThan",
                    value: "0"
                }) {
                id
                date
                dateFormatted
                temperatureC
                temperatureF
                summary
            }
        }
`;

const UpdateForecastSummaryMutation = gql`
    mutation($id: Int!, $summary: String!) {
        weatherForecasts {
            updateSummary(id: $id, summary: $summary) {
                id
                summary
            }
        }
    }
`;

const FetchData: React.FunctionComponent<Props> = props => {
    const apolloClient = useApolloClient();

    useEffect(() => {
            apolloClient.writeData({
                data: {
                    weatherForecastIndex: parseInt(props.match.params.startDateIndex, 10) || 0
                }
            });
        },
        [apolloClient, props.match.params.startDateIndex]);

    const indexQuery = useQuery<{ weatherForecastIndex: number }>(gql`
    {
        weatherForecastIndex @client
    }
`);
    const index = indexQuery.data && indexQuery.data.weatherForecastIndex !== undefined
        ? indexQuery.data.weatherForecastIndex
        : 0;

    const forecastQuery = useQuery<{ weatherForecasts: Forecast[] }, { startIndex: number }>(
        GetForecasts,
        {
            variables: {
                startIndex: index
            },
            skip: !indexQuery.data
        });

    const [updateSummaryMutate] =
        useMutation<{ updateSummary: Forecast }, { id: number, summary: string }>(UpdateForecastSummaryMutation);

    return (
        <div>
            <h1>Weather forecast</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            {renderForecastsTable(props,
                forecastQuery.data ? forecastQuery.data.weatherForecasts : [],
                (id, summary) => updateSummaryMutate({ variables: { id, summary } }))}
            {renderPagination(index)}
            {forecastQuery.loading ? <Alert color="info">Loading...</Alert> : null}
            {forecastQuery.error ? <Alert color="danger">{`Error! ${forecastQuery.error.message}`}</Alert> : null}
        </div>
    );
}

function renderForecastsTable(props: Props,
    forecasts: Forecast[],
    updateSummary: (id: number, summary: string) => void) {
    const sortedForecasts = _.orderBy(forecasts, (f: Forecast) => f.date);
    return (
        <table className='table table-striped'>
            <thead>
            <tr>
                <th>Date</th>
                <th>Temp. (C)</th>
                <th>Temp. (F)</th>
                <th>Summary</th>
            </tr>
            </thead>
            <tbody>
            {sortedForecasts.map(forecast =>
                <tr key={forecast.dateFormatted}>
                    <td>{forecast.dateFormatted}</td>
                    <td>{forecast.temperatureC}</td>
                    <td>{forecast.temperatureF}</td>
                    <td>
                        <Input value={forecast.summary}
                               onChange={e => updateSummary(forecast.id, e.target.value)}/>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}

function renderPagination(index: number) {
    const prevStartDateIndex = index - 5;
    const nextStartDateIndex = index + 5;

    return <p className='clearfix text-center'>
               <Link className='btn btn-default pull-left' to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
               <Link className='btn btn-default pull-right' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
           </p>;
}

export default FetchData;