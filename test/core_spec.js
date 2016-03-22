import {List, Map} from  'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

describe('Application Logic', () => {
    describe('setEntries', () => {
        it('adds entries to the state', () => {
            const state = Map();
            const entries = ['Trainspotting'];
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({entries: List.of('Trainspotting')}));

        });
    });

    describe('next', () => {
        //:-}
        it('takes the next new items under the vote', () => {
            const state = setEntries(Map(), ['Trainspotting', '28 Days Later', 'Sunshine']);
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({pair: List.of('Trainspotting', '28 Days Later')}),
                entries: List.of('Sunshine')
            }));
        });
        //-:}
        it('puts the winner of current vote back to entries', ()=> {
            const state = Map({
                entries: List.of('Sunshine', 'Millions', 'Terminator'),
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                })
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                entries: List.of('Terminator', 'Trainspotting'),
                vote: Map({
                    pair: List.of('Sunshine', 'Millions')
                })
            }));
        });
        //-:}
        it('it puts both from tied vote back to entries', ()=> {
            const state = Map({
                entries: List.of('Sunshine', 'Millions', 'Terminator'),
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 2,
                        '28 Days Later': 2
                    })
                })
            });

            const newState = next(state);

            expect(newState).to.equal(Map({
                entries: List.of('Terminator', 'Trainspotting', '28 Days Later'),
                vote: Map({
                    pair: List.of('Sunshine', 'Millions')
                })
            }));
        });
        //-:}
        it('marks winner when only one entry left', ()=> {
            const state = Map({
                entries: List.of(),
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 2,
                        '28 Days Later': 1
                    })
                })
            });
            const newState = next(state);
            expect(newState).to.equal(Map({winner: 'Trainspotting'}));
        });
    });

    describe('vote', () => {
        it('creates a tally for the voted entry', () => {
            const state = Map({pair: List.of('Trainspotting', '28 Days Later')}),
                nextState = vote(state, 'Trainspotting');

            expect(nextState).to.equal(
                Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({'Trainspotting': 1})

                }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({'Trainspotting': 1})
            });

            const newState = vote(state, 'Trainspotting');

            expect(newState).to.equal(Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({'Trainspotting': 2})
            }));
        });

    });
});


