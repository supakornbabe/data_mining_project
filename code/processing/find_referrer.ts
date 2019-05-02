import path from 'path';
import readline from 'readline';
import fs from 'fs';
import { stringify, parse } from 'csv';

(async function() {
    let count = 0;
    let totalCount = 0;

    const dataPaths = [ 'pantip.com.csv', 'm.pantip.com.csv' ] ;

    const edgeSet = new Set<string>();
    const edges = new Array<{ from: string, to: string }>();
    
    for (const dataPath of dataPaths) {
        const ifs = fs.createReadStream(path.resolve(`../data/processed/interested_referrer/${dataPath}`), {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
            input: ifs,
            terminal: false
        });
    
        const refMap = new Map<Number, number>();
        let refCount = 0;
        await new Promise(function(resolve, reject) {
            rl.on('line', function(line) {
                if (count == 1000) {
                    // console.log(totalCount);
                    count = 0;
                }
                count++;
                totalCount++;
    
                const splits = line.split(',', 2);
                const referrerName = splits[1];
                const matches = referrerName.match(/pantip.com\/r\/([0-9]*)\//);
                if (matches !== null) {
                    const edgeStr = `${splits[0]}:${matches[1]}`;
                    if (!!!edgeSet.has(edgeStr)) {
                        edgeSet.add(edgeStr);
                        refCount++;
                        edges.push({ from: splits[0], to: matches[1] });
                    }
                    // refMap.set(Number.parseInt(splits[0]), Number.parseInt(matches[1]));
                    // console.log('1 ', splits[0], ' ', matches[1], ' ', refCount);
                } else {
                    refCount++;
                    const matches2 = referrerName.match(/pantip.com\/topic\/([0-9]*)/);
                    if (matches2 !== null) {
                        const edgeStr = `${splits[0]}:${matches2[1]}`;
                        if (!!!edgeSet.has(edgeStr)) {
                            edgeSet.add(edgeStr);
                            refCount++;
                            edges.push({ from: splits[0], to: matches2[1] });
                        }
                        // refMap.set(Number.parseInt(splits[0]), Number.parseInt(matches2[1]));
                        // console.log('2 ', splits[0], ' ', matches2[1], ' ', refCount);
                    } else {
                        // console.log(splits[1]);
                    }
                }
            });
    
            rl.on('close', () => { resolve() });
        });
    
        // refMap.forEach((value, key) => {
        //     console.log(`${key},${value}`);
        // });
    }
    edges.forEach(edge => {
        console.log(`${edge.from},${edge.to}`);
    })
})();