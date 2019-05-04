import path from 'path';
import readline from 'readline';
import fs from 'fs';

const EDGE_WEIGHT_THRESHOLD = 25;

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

    const edgeMap = new Map<string, number>();
    await new Promise(function(resolve, reject) {
        rl.on('line', function(line) {
            if (count == 1000) {
                // console.log(totalCount);
                count = 0;
            }
            count++;
            totalCount++;

            const splits = line.split(',', 2);

            // prevent self-loop
            if (splits[0].localeCompare(splits[1]) === 0) {
                return;
            }

            const key = `${splits[0]},${splits[1]}`;

            if (edgeMap.has(key)) {
                const weight = edgeMap.get(key) || 0;
                edgeMap.set(key, weight + 1);
            } else {
                edgeMap.set(key, 1);
            }
        });

        rl.on('close', () => { resolve() });
    });

    let passed = 0;
    edgeMap.forEach((value, key) => {
        if (value >= EDGE_WEIGHT_THRESHOLD) {
            console.log(key);
            passed++;
            
        }
    });
    // console.log(passed);
    // console.log(edgeMap.size);
})();