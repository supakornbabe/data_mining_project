import path from 'path';
import readline from 'readline';
import fs from 'fs';
import { stringify } from 'csv';

const topicIdSet = new Set<number>();

let count = 0;
let id = 1;
let totalCount = 0;
let roomSet: Map<string, number>;

const ws = fs.createWriteStream(path.resolve(`../data/topic_rooms.csv`), {
    encoding: 'utf-8'
});

const stringifier = stringify({
    header: false,
    columns: [ 'id', 'topic_id', 'room_id' ]
});
stringifier.pipe(ws);

const readFile = file => new Promise((resolve, reject) => {
    const ifs = fs.createReadStream(path.resolve(`../data/${file}`), {
        encoding: 'utf-8'
    });

    const rl = readline.createInterface({
        input: ifs,
        terminal: false
    });

    rl.on('line', function(line) {
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

            if (count >= 10000) {
                count = 0;
                totalCount += 10000;
                console.log(totalCount);
            }
            count++;

            if (topic_id === undefined ||
                comment_id === undefined ||
                device === undefined ||
                browser === undefined ||
                os === undefined ||
                referrer === undefined ||
                rooms === undefined ||
                tags === undefined ||
                mid === undefined ||
                tc === undefined ||
                updated_time === undefined)
            {
                return;
            }

            if (!!!topicIdSet.has(topic_id)) {
                topicIdSet.add(topic_id);

                for (const room of rooms) {
                    stringifier.write([ id, topic_id, roomSet.get(room) ]);
                    id++;
                }
            }
        } catch (err) {

        }
    });

    rl.on('close', () => resolve());
});

function uniqueFileToMap(path: string): Promise<Map<string, number>> {
    return new Promise(function(resolve, reject) {
        const map = new Map<string, number>();
    
        const ifs = fs.createReadStream(path, {
            encoding: 'utf-8'
        });
    
        const rl = readline.createInterface({
            input: ifs,
            terminal: false
        });
    
        let count = 1;
        rl.on('line', line => {
            map.set(line, count);
            count++;
        });
    
        rl.on('close', () => resolve(map));
    });
}

uniqueFileToMap(path.resolve('../data/unique_room.txt'))
.then(set => {
    roomSet = set;
    return readFile('ptlog_20181015.json')
})
.then(() => readFile('ptlog_20181016.json'))
.then(() => readFile('ptlog_20181017.json'))
.then(() => readFile('ptlog_20181018.json'))
.then(() => readFile('ptlog_20181019.json'))
.then(() => readFile('ptlog_20181020.json'))
.then(() => readFile('ptlog_20181021.json'))
.then(() => {
    stringifier.end();
});