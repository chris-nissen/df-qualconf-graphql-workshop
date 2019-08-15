import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

interface Props {
}

const Counter: React.FunctionComponent<Props> = props => {
    const { data, client } = useQuery(gql`
    {
        count @client
    }
`);

    return (
        <div>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p>Current count: <strong>{data.count}</strong></p>

            <button className="btn btn-primary" onClick={() =>
                client.writeData({ data: { count: data.count + 1 } })
            }>Increment</button>
        </div>
    );
};

export default Counter;