import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import ApolloClient from 'apollo-boost';

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: (baseUrl as string | undefined) });

const apolloClient = new ApolloClient({
    resolvers: {}
});

apolloClient.writeData({
    data: {
        count: 42
    }
});

const rootElement = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
        <App apolloClient={apolloClient} />
    </BrowserRouter>,
    rootElement);

registerServiceWorker();
