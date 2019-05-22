import path from 'path';
import readline from 'readline';
import fs from 'fs';

(async function() {
    let count = 0;
    let sum = 0;
    let weight: number[] = [];
    await (async function() {
        let ifs = fs.createReadStream(path.resolve(`relation_2.csv`), {
            encoding: 'utf-8'
        });
    
        let rl = readline.createInterface({
            input: ifs,
            terminal: false
        });
    
        const edgeMap = new Map<string, number>();
        await new Promise(function(resolve, reject) {
            rl.on('line', function(line) {
                const splits = line.split(',');
                sum += +splits[2];
                count++;
                weight.push(+splits[2]);
            });
    
            rl.on('close', () => { resolve() });
        });
    })();

    const sortedWeight = weight.sort();
    let median = 0;
    let mid = Math.floor(sortedWeight.length / 2);
    if (sortedWeight.length % 2 == 0) {
        median = (sortedWeight[mid] + sortedWeight[mid + 1]) / 2;
    } else {
        median = sortedWeight[mid];
    }

    const avg = sum / count;
    await (async function() {
        let ifs = fs.createReadStream(path.resolve(`relation_2.csv`), {
            encoding: 'utf-8'
        });
    
        let rl = readline.createInterface({
            input: ifs,
            terminal: false
        });
    
        const edgeMap = new Map<string, number>();
        await new Promise(function(resolve, reject) {
            rl.on('line', function(line) {
                const splits = line.split(',');
                if (+splits[2] >= median) {
                    console.log(`${splits[0]},${splits[1]}`);
                }
            });
    
            rl.on('close', () => { resolve() });
        });
    })();
    console.log(median);
    // console.log(passed);
    // console.log(edgeMap.size);
})();