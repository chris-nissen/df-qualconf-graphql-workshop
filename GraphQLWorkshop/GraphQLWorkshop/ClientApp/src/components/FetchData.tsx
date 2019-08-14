import React, { Component, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionCreators, WeatherForecastsState } from '../store/WeatherForecasts';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store/configureStore';
import { Input, Button, Alert } from 'reactstrap';
import _ from 'lodash';
import { Forecast } from 'models';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

type Props = WeatherForecastsState
    & typeof actionCreators
    & RouteComponentProps<{ startDateIndex: string }>;

const GetForecasts = gql`
        query($startIndex: Int!) {
            weatherForecasts(index: $startIndex) {
                id
                date
                dateFormatted
                temperatureC
                temperatureF
                summary
            }
        }
`;

const FetchData: React.FunctionComponent<Props> = props => {
    useEffect(() => {
        const startDateIndex = parseInt(props.match.params.startDateIndex, 10) || 0;
        props.requestWeatherForecasts(startDateIndex);
    });

    const { loading, error, data } = useQuery(GetForecasts,
        {
            variables: {
                startIndex: props.startDateIndex || 0
            }
        });

    return (
        <div>
            <h1>Weather forecast</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            {renderForecastsTable(props, data ? data.weatherForecasts : [])}
            {renderPagination(props)}
            {loading ? <Alert color="info">Loading...</Alert> : null}
            {error ? <Alert color="danger">{`Error! ${error.message}`}</Alert> : null}
        </div>
    );
}

function renderForecastsTable(props: Props, forecasts: Forecast[]) {
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
                               onChange={e => props.updateWeatherForecast(forecast.id, e.target.value)}/>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}

function renderPagination(props: Props) {
    const prevStartDateIndex = (props.startDateIndex || 0) - 5;
    const nextStartDateIndex = (props.startDateIndex || 0) + 5;

    return <p className='clearfix text-center'>
               <Link className='btn btn-default pull-left' to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
               <Link className='btn btn-default pull-right' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
           </p>;
}

export default connect(
    (state: ApplicationState) => state.weatherForecasts,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(FetchData);