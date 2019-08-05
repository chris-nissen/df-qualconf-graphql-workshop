import { Action, Reducer } from 'redux';

export interface CounterState {
    count: number;
}

const incrementCountActionType = 'INCREMENT_COUNT';
const decrementCountActionType = 'DECREMENT_COUNT';
const initialState: CounterState = { count: 0 };

export const actionCreators = {
    increment: () => ({ type: incrementCountActionType }),
    decrement: () => ({ type: decrementCountActionType })
};

export const reducer: Reducer<CounterState, Action> =
    (state: CounterState | undefined, action: Action) => {
  state = state || initialState;

    if (action.type === incrementCountActionType) {
    return { ...state, count: state.count + 1 };
  }

    if (action.type === decrementCountActionType) {
    return { ...state, count: state.count - 1 };
  }

  return state;
};
