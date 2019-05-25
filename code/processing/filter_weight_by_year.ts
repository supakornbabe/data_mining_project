import path from 'path';
import readline from 'readline';
import fs from 'fs';

const fsp = fs.promises;

(async function() {

    const validTopicSet = new Set<string>();
    await (async function() {
        const ifs = fs.createReadStream(path.resolve(`../data/processed_except/2017.csv`), {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
                input: ifs,
                terminal: false
        });
    
        await new Promise((resolve, reject) => {
            rl.on('line', line => {
                validTopicSet.add(line);
            });
    
            rl.on('close', () => { resolve(); });
        });
    })();

    await (async function() {
        const ifs = fs.createReadStream(path.resolve(`../data/processed_except/pantip_edge_10_with_weight.csv`), {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
                input: ifs,
                terminal: false
        });
    
        await new Promise((resolve, reject) => {
            rl.on('line', line => {
                const splits = line.split(',');
                if (validTopicSet.has(splits[0]) && validTopicSet.has(splits[1])) {
                    console.log(line);
                }
            });
    
            rl.on('close', () => { resolve(); });
        });
    })();
})();