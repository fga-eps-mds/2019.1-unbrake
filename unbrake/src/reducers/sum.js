const sum = (state = {}, action) => { //Jeito de definir uma função
  switch (action.type) {
    case 'ADD':
      console.log(state, action)
      return {...state, sum: +action.n1 + +action.n2};
      
    default:
      return state
  }
}

export default sum 
