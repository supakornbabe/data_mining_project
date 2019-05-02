import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {
    let count = 0;
    let totalCount = 0;

    const ifs = fs.createReadStream(path.resolve(`../data/processed/edges.csv`), {
        encoding: 'utf-8'
    });

    const rl = readline.createInterface({
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

    adjMap.forEach((value, key) => {
        console.log(JSON.stringify({ src: key, dest: value }));
    });
})();