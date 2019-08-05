import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Counter';
import { ApplicationState } from '../store/configureStore';

interface Props {
    count: number;
    increment: () => void;
}

const Counter: React.FunctionComponent<Props> = props => (
  <div>
    <h1>Counter</h1>

    <p>This is a simple example of a React component.</p>

    <p>Current count: <strong>{props.count}</strong></p>

    <button className="btn btn-primary" onClick={props.increment}>Increment</button>
  </div>
);

export default connect(
  (state: ApplicationState) => state.counter,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Counter);
