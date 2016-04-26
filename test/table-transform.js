function sum(m) {
    return Object.keys(m).reduce((s, k) => {
        const val = m[k];
        if (val !== undefined || val !== null) {
            s += val;
        }
        return s;
    }, 0)
}
function sub(tree, coll) {
    const subFields = Object.keys(tree);

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

function sumTable(tree, fieldName) {
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



describe('flatten hierarchy', () => {
    const tree = {
            GBP: {
                0.0: {
                    DV01: {s1: 10, s2: 11},
                    NPV: {s1: 12, s3: 13}
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
            values: [0.0, 1.0]

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
            }];


    it('should be able to flat it', () => {
        console.log(sumTable(tree['GBP'], 'ladder'));
    });

});