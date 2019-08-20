import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import ApolloClient from 'apollo-boost';

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
