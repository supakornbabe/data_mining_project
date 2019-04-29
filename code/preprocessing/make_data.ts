import path from 'path';
import readline from 'readline';
import fs from 'fs';

function uniqueFileToMap(path: string): Promise<Map<any, number>> {
    return new Promise((resolve, reject) => {
        const map = new Map();
    
        const ifs = fs.createReadStream(path, {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
            input: ifs,
            terminal: false
        });
    
        let count = 1;
        rl.on('line', line => {
            map.set(count, line);
            count++;
        });
    
        rl.on('end', () => resolve(map));         
    });
}


Promise.resolve(async function() {
    
});

// const filename = 'unique_referrer';
const filename = 'referrer';

const ifs = fs.createReadStream(path.resolve(`../data/${filename}.json`), {
        encoding: 'utf-8'
});

const ws = fs.createWriteStream(path.resolve(`../data/${filename}_data.csv`), {
        encoding: 'utf-8'
});

const rl = readline.createInterface({
    input: ifs,
    terminal: false
});

let browserSet: Map<string, number> = new Map();


uniqueFileToMap(path.resolve('../data/unique_browser.txt'))
.then(set => {
    browserSet = set;
    return uniqueFileToMap(path.resolve('../data/unique_browser.txt'));
})



rl.on('line', line => {
    try {
        const json = eval(`(${line})`);
        const {
            topic_id,
            comment_id,
            device,
            browser,
            os,
            referrer,
            rooms,
            tags,
            mid,
            tc,
            updated_time
        } = json;



    } catch (err) {

    }
});