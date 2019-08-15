import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import * as Counter from './Counter';
import * as WeatherForecasts from './WeatherForecasts';
import { History } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

export interface ApplicationState {
    counter: Counter.CounterState,
    weatherForecasts: WeatherForecasts.WeatherForecastsState
}

export default function configureStore(history: History, initialState: ApplicationState) {
    const reducers = {
        counter: Counter.reducer,
        weatherForecasts: WeatherForecasts.reducer
    };

    const middleware = [
        routerMiddleware(history),
        thunk
    ];

    // In development, use the browser's Redux dev tools extension if installed
    const enhancers = [];
    const isDevelopment = process.env.NODE_ENV === 'development';
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    if (isDevelopment && windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }

    const createRootReducer = (history: History) => combineReducers({
        ...reducers,
        router: connectRouter(history)
    });

    return createStore(
        createRootReducer(history),
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );
}

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}