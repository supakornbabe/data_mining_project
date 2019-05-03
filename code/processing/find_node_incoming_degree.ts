import path from 'path';
import readline from 'readline';
import fs from 'fs';

const INCOMING_THRESHOLD = 10;

(async function() {
    let count = 0;
    let totalCount = 0;

    let ifs = fs.createReadStream(path.resolve(`../data/processed/edges.csv`), {
        encoding: 'utf-8'
    });

    let rl = readline.createInterface({
        input: ifs,
        terminal: false
    });

    const adjMap = new Map<string, string[]>();
    await new Promise(function(resolve, reject) {
        rl.on('line', function(line) {
            if (count == 1000) {
                // console.log(totalCount);
                count = 0;
            }
            count++;
            totalCount++;

            const splits = line.split(',', 2);
            if (!!!adjMap.has(splits[0])) {
                adjMap.set(splits[0], [ splits[1] ]);
            } else {
                const arr = adjMap.get(splits[0]);
                if (arr !== undefined) {
                    arr.push(splits[1]);
                }
            }
        });

        rl.on('close', () => { resolve() });
    });

    const nodeSet = new Set<string>();
    adjMap.forEach((value, key) => {
        if (value.length >= INCOMING_THRESHOLD) {
            nodeSet.add(key);
            // console.log(key);
        }
    });
    // console.log('size: ', nodeSet.size);
    adjMap.clear();

    ifs = fs.createReadStream(path.resolve(`../data/processed/edges.csv`), {
        encoding: 'utf-8'
    });

    rl = readline.createInterface({
        input: ifs,
        terminal: false
    });

    await new Promise(function(resolve, reject) {
        rl.on('line', function(line) {
            if (count == 1000) {
                // console.log(totalCount);
                count = 0;
            }
            count++;
            totalCount++;

            const splits = line.split(',', 2);
            if (nodeSet.has(splits[0]) && nodeSet.has(splits[1]) && splits[0].localeCompare(splits[1]) !== 0) {
                if (!!!adjMap.has(splits[0])) {
                    adjMap.set(splits[0], [ splits[1] ]);
                } else {
                    const arr = adjMap.get(splits[0]);
                    if (arr !== undefined) {
                        arr.push(splits[1]);
                    }
                }
            }
        });

        rl.on('close', () => { resolve() });
    });

    let edgeCount = 0;
    console.log("Source,Target");
    adjMap.forEach((value, key) => {
        // console.log(key);
        // edgeCount += value.length;
        for (const src of value) {
            console.log(`${src},${key}`);
        }
    });
    // console.log('size: ', adjMap.size, ' ', edgeCount);
})();