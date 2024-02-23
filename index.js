
// Redux 3 principles 
// (1) Single source of truth (global store)
// (2) Immutable Updates state read-only
// (3) Reducer should be pure - No side effects 

import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import axios from 'axios'
import { thunk } from 'redux-thunk'

// Actions name constants
// const init = "account/init"
const inc = "account/increment"
const dec = "account/decrement"
const incByAmt = "account/incrementByAmount"
const getAccUserPending = "bonus/getuser/pending"
const getAccUserFulfilled = "bonus/getuser/fulfilled"
const getAccUserRejected = "bonus/getuser/rejected"
const incBonus = "bonus/increment"


// global store
const store = createStore(
    combineReducers({
        account: accountReducer,
        bonus: bonusReducer
    }),
    applyMiddleware(logger.default, thunk))


const history = []

// reducer function for account
function accountReducer(state = { amount: 1 }, action) {
    switch (action.type) {
        case getAccUserFulfilled:
            return { amount: action.payload, pending: false }
        case getAccUserRejected:
            return { ...state, error: action.error, pending: false }
        case getAccUserPending:
            return { ...state, pending: true }
        case inc:
            return { amount: state.amount + 1 }
        case dec:
            return { amount: state.amount - 1 }
        case incByAmt:
            return { amount: state.amount + action.payload }
        default:
            return state
    }
}

// reducer function for bonus
function bonusReducer(state = { points: 1 }, action) {

    switch (action.type) {
        case incBonus:
            return { points: state.points + 1 }
        case incByAmt:
            if (action.payload >= 100) {
                return { points: state.points + 1 }
            } else {
                return state
            }
        default :
        return state
 
    }

}



// store.subscribe(() => {
//     history.push(store.getState())
//     console.log(history)
// }





// Action creators

function getUserAccount(id) {
    return async (dispatch, getState) => {
        try {

            const { data } = await axios.get(`http://localhost:3000/account/${id}`)
            console.log(data)
            dispatch(getAccountUserFulfilled(data.amount))
        } catch (error) {
            dispatch(getAccountUserRejected(error.message))
        }

    }
}

function getAccountUserFulfilled(value) {
    return { type: getAccUserFulfilled, payload: value }
}
function getAccountUserPending(value) {
    return { type: getAccUserPending, pending: false }
}
function getAccountUserRejected(error) {
    return { type: getAccUserRejected, error: error }
}


function initUser(value) {
    return { type: init, payload: value }
}

function increment() {
    return { type: inc }
}

function decrement() {
    return { type: dec }
}

function incrementByAmount(value) {
    return { type: incByAmt, payload: value }
}


setTimeout(() => {
    store.dispatch(getUserAccount(1))
}, 2000)






























































