import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import configureStore, { ApplicationState } from './store/configureStore';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import ApolloClient from 'apollo-boost';

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: (baseUrl as string | undefined) });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(history, initialState);

const apolloClient = new ApolloClient({
    resolvers: {}
});

apolloClient.writeData({
    data: {
        count: 42
}});

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
            <App apolloClient={apolloClient} />
    </ConnectedRouter>
  </Provider>,
  rootElement);

registerServiceWorker();
