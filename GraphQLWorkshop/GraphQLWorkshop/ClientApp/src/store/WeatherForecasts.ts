import { Action, Reducer } from 'redux';
import { Forecast } from 'models';
import { AppThunkAction } from './configureStore';

export interface WeatherForecastsState {
    forecasts: Forecast[];
    isLoading: boolean;
    startDateIndex: number | undefined;
}

const requestForecastsActionType = 'REQUEST_WEATHER_FORECASTS';
const receiveForecastsActionType = 'RECEIVE_WEATHER_FORECASTS';

export interface RequestForecastsAction extends Action {
    type: typeof requestForecastsActionType;
    startDateIndex: number;
}

export interface ReceiveForecastsAction extends Action {
    type: typeof receiveForecastsActionType;
    startDateIndex: number;
    forecasts: Forecast[];
}

type WeatherForecastsAction = RequestForecastsAction
    | ReceiveForecastsAction;

const initialState = { forecasts: [], isLoading: false, startDateIndex: undefined };

export const actionCreators = {
    requestWeatherForecasts: (startDateIndex: number): AppThunkAction<WeatherForecastsAction> => async (dispatch, getState) => {
        if (startDateIndex === getState().weatherForecasts.startDateIndex) {
            // Don't issue a duplicate request (we already have or are loading the requested data)
            return;
        }

        dispatch({ type: requestForecastsActionType, startDateIndex });

        const url = `api/SampleData/WeatherForecasts?startDateIndex=${startDateIndex}`;
        const response = await fetch(url);
        const forecasts = await response.json();

        dispatch({ type: receiveForecastsActionType, startDateIndex, forecasts });
    }
};

export const reducer: Reducer<WeatherForecastsState, WeatherForecastsAction> =
    (state: WeatherForecastsState | undefined, action: WeatherForecastsAction) => {
        state = state || initialState;

        if (action.type === requestForecastsActionType) {
            return {
                ...state,
                startDateIndex: action.startDateIndex,
                isLoading: true
            };
        }

        if (action.type === receiveForecastsActionType) {
            return {
                ...state,
                startDateIndex: action.startDateIndex,
                forecasts: action.forecasts,
                isLoading: false
            };
        }

        return state;
    };
