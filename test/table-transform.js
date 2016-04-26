import {expect} from 'chai';

function sum(m) {
    return Object.keys(m).reduce((s, k) => {
        const val = m[k];
        if (val !== undefined || val !== null) {
            s += val;
        }
        return s;
    }, 0)
}
function sub(filter, tree, coll) {
    const subFields = Object.keys(tree).filter(sf => {
        return (filter !== undefined) ? filter === sf : true
    });

    subFields.reduce((c, subField) => {
        const existing = c[subField];
        if (existing) {
            existing.values.push(sum(tree[subField]));
        } else {
            c[subField] = {name: subField, type: 'double', values: [sum(tree[subField])]}
        }
        return c;
    }, coll);
}

function getAsTuple(ob) {
    return Object.keys(ob).reduce((coll, f)=> {
        coll.push([f, ob[f]]);
        return coll;
    }, []);
}

function sub1(filter, tree, coll) {
    const subFields = Object.keys(tree).filter(sf => {
        return (filter !== undefined) ? filter === sf : true
    });

    subFields.forEach(subField => {
        getAsTuple(tree[subField])
            .forEach(tuple => {
                const
                    fieldName = tuple[0],
                    fieldValue = tuple[1],
                    existing = coll[fieldName];
                if (existing) {
                    existing.values.push(fieldValue);
                } else {
                    coll[fieldName] = {name: fieldName, type: 'double', values: [fieldValue]}
                }

            });


    });

}

function sumTable(tree, fieldName, sub) {
    const mainFields = Object.keys(tree);

    let hashed = mainFields.reduce((columns, mainField)=> {
        const existing = columns[fieldName],
            subTree = tree[mainField];

        if (existing) {
            existing.values.push(mainField);
        } else {
            columns[fieldName] = {name: fieldName, type: 'double', values: [mainField]};
        }
        sub(subTree, columns);
        return columns;
    }, {});

    return Object.keys(hashed).reduce((coll, v)=> {
        coll.push(hashed[v]);
        return coll;
    }, []);
}

function partial(f, v) {
    return f.bind(undefined, v);
}


describe('flatten hierarchy', () => {
    const tree = {
            GBP: {
                0.0: {
                    DV01: {s1: 10, s2: 11},
                    NPV: {s1: 12, s2: 13}
                },
                1.0: {
                    DV01: {s1: -1, s2: -2},
                    NPV: {s1: -4, s2: -3}
                }
            }
        },
        total_expected = [{
            name: 'ladder',
            type: 'double',
            values: ['0', '1']

        },
            {
                name: 'DV01',
                type: 'double',
                values: [21, -3]
            },
            {
                name: 'NPV',
                type: 'double',
                values: [25, -7]
            }],
        npv_expected = [
            {name: 'ladder', type: 'double', values: ['0', '1']},
            {name: 's1', type: 'double', values: [12, -4]},
            {name: 's2', type: 'double', values: [13, -3]}
        ],
        dv01_expected = [
            {name: 'ladder', type: 'double', values: ['0', '1']},
            {name: 's1', type: 'double', values: [10, -1]},
            {name: 's2', type: 'double', values: [11, -2]}
        ];


    it('should be able to flat it and calculate total', () => {
        const totals = sumTable(tree['GBP'], 'ladder', partial(sub));
        expect(totals).to.deep.equal(total_expected);
        console.log(totals);
    });

    it('should flatten NPV and have security details', ()=> {
        const totals = sumTable(tree['GBP'], 'ladder', partial(sub1, 'NPV'));
        expect(totals).to.deep.equal(npv_expected);
        console.log(totals);
    });

    it('should flatten NPV and have security details', ()=> {
        const totals = sumTable(tree['GBP'], 'ladder', partial(sub1, 'DV01'));
        expect(totals).to.deep.equal(dv01_expected);
        console.log(totals);
    });

});