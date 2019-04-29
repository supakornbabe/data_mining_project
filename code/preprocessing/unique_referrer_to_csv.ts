import path from 'path';
import readline from 'readline';
import fs from 'fs';
import { stringify } from 'csv';

const filename = 'unique_referrer';

const ifs = fs.createReadStream(path.resolve(`../data/${filename}.txt`), {
        encoding: 'utf-8'
});

const ws = fs.createWriteStream(path.resolve(`../data/${filename}.csv`), {
        encoding: 'utf-8'
});

const stringifier = stringify({
    header: false,
    columns: [ 'id', 'referrer_name' ]
});
stringifier.pipe(ws);

const rl = readline.createInterface({
    input: ifs,
    terminal: false
});

let id = 1;
rl.on('line', function(line) {
    const split = line.split('/');
    let domainName = '/';
    if (split.length >= 3) {
        domainName = split[2];
    }

    stringifier.write([ id, domainName, line ]);
    id++;
});

rl.on('close', () => { stringifier.end(); });