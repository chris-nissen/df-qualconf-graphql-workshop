import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import ApolloClient  from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

export default () => {
    const apolloClient = new ApolloClient({ resolvers: {} });
    apolloClient.writeData({
        data: {
            count: 42
        }
    });

    return (
        <ApolloProvider client={apolloClient}>
            <Layout>
                <Route exact path='/' component={Home}/>
                <Route path='/counter' component={Counter}/>
                <Route path='/fetch-data/:startDateIndex?' component={FetchData}/>
            </Layout>
        </ApolloProvider>
    );
};
