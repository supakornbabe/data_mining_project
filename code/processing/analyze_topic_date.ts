import path from 'path';
import readline from 'readline';
import fs from 'fs';

const fsp = fs.promises;

(async function() {

    const countMap = new Map<string, number>();
    const ifs = fs.createReadStream(path.resolve(`../data/processed_except/topics.json`), {
        encoding: 'utf-8'
    });

    const rl = readline.createInterface({
            input: ifs,
            terminal: false
    });

    let count = 0;
    const yearMap = new Map<number, string[]>();
    await new Promise((resolve, reject) => {
        rl.on('line', line => {
            const json = JSON.parse(line);
            const extract = {
                date: new Date(json.date),
                topic_id: json.topic_id
            };
            const arr = yearMap.get(extract.date.getFullYear()) || [];
            arr.push(json.topic_id);
            yearMap.set(extract.date.getFullYear(), arr);
            // console.log(extract);
        });

        rl.on('close', () => { resolve(); });
    });
    for (const year of yearMap.keys()) {
        console.log(year);
        const value = yearMap.get(year) || [];
        let output = '';
        value.forEach(v => {
            output += `${v}\n`;
        })
        await fsp.writeFile(`${year}.csv`, output, { encoding: 'utf-8' });
    }
})();