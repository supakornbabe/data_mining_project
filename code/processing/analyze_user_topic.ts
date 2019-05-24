import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {

    const countMap = new Map<string, number>();
    await (async function() {
        const ifs = fs.createReadStream(path.resolve(`user_topics.1.csv`), {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
                input: ifs,
                terminal: false
        });
    
        await new Promise((resolve, reject) => {
            rl.on('line', line => {
                const splits = line.split(',');
                const count = countMap.get(splits[1]) || 0;
                countMap.set(splits[1], count + 1);
            });
    
            rl.on('close', () => { resolve(); });
        });
    })();

    const mapEntries = [...countMap.entries()].sort((a, b) => b[1] - a[1]);
    const mid = Math.floor(mapEntries.length / 2);

    let median = 0;
    if (mapEntries.length % 2 === 0) {
        median = (mapEntries[mid][1] + mapEntries[mid + 1][1]) / 2;
    } else {
        median = mapEntries[mid][1];
    }

    let sum = 0;
    let count = 0;
    const sortedMap = new Map(mapEntries);
    const validSet = new Set<string>();
    sortedMap.forEach((value, key) => {
        if (value >= 10) {
            count++;
            // console.log(key);
            validSet.add(key);
        }
        sum += value;
    });

    // console.log(sortedMap.size);
    // console.log(median);
    // console.log(count);
    // console.log(sum / sortedMap.size);

    await (async function() {
        const ifs = fs.createReadStream(path.resolve(`user_topics.1.csv`), {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
                input: ifs,
                terminal: false
        });
    
        await new Promise((resolve, reject) => {
            rl.on('line', line => {
                const splits = line.split(',');
                if (validSet.has(splits[1])) {
                    console.log(line);
                }
            });
    
            rl.on('close', () => { resolve(); });
        });
    })();
})();