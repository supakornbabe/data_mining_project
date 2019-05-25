import path from 'path';
import readline from 'readline';
import fs from 'fs';

const USER_TOPICS_THRESHOLD = 10;

(async function() {

    const countMap = new Map<string, number>();
    await (async function() {
        const ifs = fs.createReadStream(path.resolve(`../data/user_topics.csv`), {
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
        if (value >= USER_TOPICS_THRESHOLD) {
            count++;
            validSet.add(key);
        }
        sum += value;
    });

    await (async function() {
        const ifs = fs.createReadStream(path.resolve(`../data/user_topics.csv`), {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
                input: ifs,
                terminal: false
        });

        const ofs = fs.createWriteStream(path.resolve(`../data/user_topic_filtered.csv`), {
            encoding: 'utf-8'
        });

        ofs.write("Source,Target");
        ofs.write("\n");
        await new Promise((resolve, reject) => {
            rl.on('line', line => {
                const splits = line.split(',');
                if (validSet.has(splits[1])) {
                    ofs.write(line);
                    ofs.write("\n");
                }
            });
    
            rl.on('close', () => { resolve(); });
        });
        ofs.close();
    })();
})();