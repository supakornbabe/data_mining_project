import fs from 'fs';
import path from 'path';
import readline from 'readline';

const INCOMING_EDGE_DEGREE_THRESHOLD = 10;
const OUTGOING_EDGE_DEGREE_THRESHOLD = 10;

(async function() {
    const incomingMap = new Map<string , number>();
    const outgoingMap = new Map<string, number>();
    const nodeSet = new Set<string>();
    const validNode = new Set<string>();

    const ifs = fs.createReadStream(path.resolve(`../data/processed/edge_incoming_10_with_comid_0.csv`), {
        encoding: 'utf-8'
    });
    
    const rl = readline.createInterface({
        input: ifs,
        terminal: false
    });

    await new Promise(function(resolve, reject) {
        rl.on('line', function(line) {
            const matches = line.match(/([0-9]*),([0-9]*)/);
            if (matches !== null && matches[1] !== '' && matches[2] !== '') {
                const target = matches[1];
                const source = matches[2];

                if (!!!nodeSet.has(target)) {
                    nodeSet.add(target);
                }

                if (!!!nodeSet.has(source)) {
                    nodeSet.add(source);
                }

                if (incomingMap.has(target)) {
                    const value = incomingMap.get(target) || 0;
                    incomingMap.set(target, value + 1);
                } else {
                    incomingMap.set(target, 1);
                }
                // console.log(matches[1], ' ', matches[2]);

                if (outgoingMap.has(source)) {
                    const value = outgoingMap.get(source) || 0;
                    outgoingMap.set(source, value + 1);
                } else {
                    outgoingMap.set(source, 1);
                }
            }
        });
        
        rl.on('close', () => {  resolve() });
    });

    nodeSet.forEach(value => {
        const incoming = incomingMap.get(value) || 0;
        const outgoing = outgoingMap.get(value) || 0;
        if (incoming >= INCOMING_EDGE_DEGREE_THRESHOLD && outgoing >= OUTGOING_EDGE_DEGREE_THRESHOLD) {
            validNode.add(value);
        }
    })

    validNode.forEach(value => {
        console.log(value);
    });
    console.log(nodeSet.size);
    console.log(validNode.size);
})();
