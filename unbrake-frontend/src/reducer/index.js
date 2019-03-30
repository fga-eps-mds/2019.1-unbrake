import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

const reducers = combineReducers({form: reduxFormReducer});

export default reducers;