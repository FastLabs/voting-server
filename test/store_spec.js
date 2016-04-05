import {expect} from 'chai'
import {Map, List, fromJS} from 'immutable'
import makeStore from '../src/store'


describe('store', () => {
    it('is a redux store configured with the correct reducer', ()=> {
        const store = makeStore();
        expect(store.getState()).to.equal(Map({}));
        store.dispatch({type: 'SET_ENTRIES', entries: ['Trainspotting', 'Terminator']});
       // expect(store.getState()).to.equal(fromJS({entries: ['Trainspotting', '']}));

    });
});