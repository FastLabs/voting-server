import {List, Map} from 'immutable';


function getWinners(vote) {
    if (!vote) {
        return [];
    }
    const [a, b] = vote.get('pair');
    const aVotes = vote.getIn(['tally', a], 0);
    const bVotes = vote.getIn(['tally', b], 0);
    if (aVotes > bVotes) {
        return [a];
    }
    if (aVotes < bVotes) {
        return [b];
    }
    return [a, b];
}


export function setEntries(state, entries) {
    if (state) {
        return state.set('entries', List(entries));
    }
    return Map({'entries': List(entries)});
}

export function vote(state, entry) {
    return state.updateIn(['tally', entry], 0, tally=>tally + 1);
}

export function next(state) {
    const entries = state.get('entries').concat(getWinners(state.get('vote')));
    if (entries.size === 1) {
        return state.remove('entries').remove('vote').set('winner', entries.first());
    }
    return state.merge({
            vote: Map({pair: entries.take(2)}),
            entries: entries.skip(2)
        }
    );
}