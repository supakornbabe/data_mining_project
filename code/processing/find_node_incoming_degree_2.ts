import path from 'path';
import readline from 'readline';
import fs from 'fs';

const INCOMING_THRESHOLD = 10;

(async function() {
    let count = 0;
    let totalCount = 0;

    let ifs = fs.createReadStream(path.resolve(`../data/processed/edges_with_condition.csv`), {
        encoding: 'utf-8'
    });

    let rl = readline.createInterface({
        input: ifs,
        terminal: false
    });

    const uniqueIncomingMap = new Map<string, Set<string>>();
    await new Promise(function(resolve, reject) {
        rl.on('line', function(line) {
            if (count == 1000) {
                // console.log(totalCount);
                count = 0;
            }
            count++;
            totalCount++;

            const splits = line.split(',', 2);
            if (uniqueIncomingMap.has(splits[0])) {
                const s = uniqueIncomingMap.get(splits[0]);
                if (s !== undefined) {
                    if (!!!s.has(splits[1])) {
                        s.add(splits[1]);
                        // console.log('add: ', s.size);
                    }
                }
            } else {
                const newSet = new Set<string>();
                newSet.add(splits[1]);
                uniqueIncomingMap.set(splits[0], newSet);
            }
        });

        rl.on('close', () => { resolve() });
    });

    const nodeSet = new Set<string>();
    uniqueIncomingMap.forEach((value, key) => {
        if (value.size >= INCOMING_THRESHOLD) {
            nodeSet.add(key);
            console.log(key);
        }
    });
    console.log('size: ', nodeSet.size);
    uniqueIncomingMap.clear();
})();