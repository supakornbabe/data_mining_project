import path from 'path';
import readline from 'readline';
import fs from 'fs';

// const filename = 'unique_referrer';
const filename = 'unique_referrer';

const ifs = fs.createReadStream(path.resolve(`../data/${filename}.txt`), {
        encoding: 'utf-8'
});

const ws = fs.createWriteStream(path.resolve(`../data/${filename}.csv`), {
        encoding: 'utf-8'
});

// ws.write('"id", "domain_name", "referrer_name"\n');
// ws.write('"id", "referrer_name"\r\n');

const rl = readline.createInterface({
    input: ifs,
    terminal: false
});

let id = 1;
let max = 0;
rl.on('line', function(line) {
    const split = line.split('/');
    let domainName = '/';
    if (split.length >= 3) {
        domainName = split[2];
    }

    ws.write(`"${id}","${domainName}","${line}"`);
    ws.write("\n");
    id++;
});

rl.on('close', () => console.log(max));