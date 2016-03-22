import {expect} from 'chai';
import {Map, List} from 'immutable';
import reducer from '../src/reducer';


describe('reducer', () => {

    //-:}
    it('should handle SET_ENTRIES', ()=> {
        const state = Map();
        const setEntriesAction = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
        const newState = reducer(state, setEntriesAction);
        expect(newState).to.equal(Map({entries: List.of('Trainspotting')}));
    });
    //:-}
    it('should handle NEXT', ()=> {
        const state = Map({
            entries: List.of('Trainspotting', 'Terminator')
        });
        const nextAction = {type: 'NEXT'};
        const newState = reducer(state, nextAction);

        expect(newState).to.equal(Map(
            {
                entries: List(),
                vote: Map({
                    pair: List.of('Trainspotting', 'Terminator')
                })
            }));
    });
    //:-}
    it('should handle VOTE', ()=> {
        const state = Map({
            entries: List(),
            vote: Map({
                pair: List.of('Trainspotting', 'Terminator')
            })
        });

        const voteAction = {type: 'VOTE', entry: 'Trainspotting'};
        const newState = reducer(state, voteAction);

        expect(newState).to.equal(Map({
            entries: List(),
            vote: Map({
                pair: List.of('Trainspotting', 'Terminator'),
                tally: Map({'Trainspotting': 1})
            })
        }));
    });
    //:-}
    it('has an initial state', () => {
        const initAction = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
        const newState = reducer(undefined, initAction);
        expect(newState).to.equal(Map({entries: List.of('Trainspotting')}));

    });

    //:-}
    it('can be used with reduce', ()=> {
        const state = Map();
        const actions = [
            {type: 'SET_ENTRIES', entries: ['Trainspotting', 'Terminator', '28 Days Later']},
            {type: 'NEXT'},
            {type: 'VOTE', entry: 'Terminator'}];
        const newState = actions.reduce(reducer, state);
        expect(newState).to.equal(Map(
            {
                entries: List.of('28 Days Later'),
                vote: Map({
                    pair: List.of('Trainspotting', 'Terminator'),
                    tally: Map({'Terminator': 1})
                })
            }));
    });
});
