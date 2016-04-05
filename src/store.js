import {createStore} from 'redux'
import reducer from './reducer'
import {Map} from 'immutable'

export default function makeStore() {
    return createStore(reducer, Map({}));
}