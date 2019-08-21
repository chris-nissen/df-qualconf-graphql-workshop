import React, { Component, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionCreators, WeatherForecastsState } from '../store/WeatherForecasts';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store/configureStore';
import { Input, Alert } from 'reactstrap';
import _ from 'lodash';
import { Forecast } from 'models';

type Props = WeatherForecastsState
    & typeof actionCreators
    & RouteComponentProps<{ startDateIndex: string }>;

const FetchData: React.FunctionComponent<Props> = props => {
    useEffect(() => {
        const startDateIndex = parseInt(props.match.params.startDateIndex, 10) || 0;
        props.requestWeatherForecasts(startDateIndex);
    });

    return (
        <div>
            <h1>Weather forecast</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            {renderForecastsTable(props)}
            {renderPagination(props)}
            {props.isLoading ? <Alert color="info">Loading...</Alert> : null}
        </div>
    );
}

function renderForecastsTable(props: Props) {
    const sortedForecasts = _.orderBy(props.forecasts, (f: Forecast) => f.date);
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
                                onChange={e => props.updateWeatherForecast(forecast.id, e.target.value)} />
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
