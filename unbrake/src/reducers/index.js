import { combineReducers } from 'redux'
import sum from './sum'

const Reducer = combineReducers({ //Agrupa os componentes
	sum,
})

export default Reducer;