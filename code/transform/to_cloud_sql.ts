import path from 'path';
import readline from 'readline';
import fs, { read } from 'fs';

import mysql from 'promise-mysql';

const fsp = fs.promises;

(async function() {
    const con = await mysql.createConnection({
        host: '35.247.181.103',
        user: 'root',
        password: 'thisissecret',
        database: 'socialmine',
        ssl: {
            ca: fs.readFileSync(path.resolve(__dirname, '../certs/server-ca.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../certs/client-cert.pem')),
            key: fs.readFileSync(path.resolve(__dirname, '../certs/client-key.pem'))
        },
        insecureAuth: false,
        multipleStatements: true
    });

    const ifs = fs.createReadStream(path.resolve('../data/ptlog_20181016.json'), {
        encoding: 'utf-8'
    });

    const rl = readline.createInterface({
        input: ifs,
        terminal: false
    });

    // for progress tracking
    let count = 0;
    let total = 0;

    // data buffer
    let data: string[] = [];

    // prevent unneccessary tag and room inserting
    const topicIdSet = new Set<number>();

    rl.on('pause', async () => {
        let qcmd = "";
        console.log(data.length);
        for (let i = 0; i < data.length; i++) {
            try {
                const line = data[i];

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
            
                if (browser.length >= 255 || referrer.length >= 255) {
                    continue;
                }

                count++;
                if (count === 1000) {
                    total += count;
                    console.log(total);
                    count = 0;
                }
                
                const dcmd = `CALL InsertData(${topic_id}, '${comment_id}', '${device}', '${browser}', '${os}', '${referrer}', ${mid}, '${tc}', ${updated_time});`;
                qcmd += dcmd;

                if (!!!topicIdSet.has(topic_id)) {
                    console.log('New Topic: ' + topic_id);
                    topicIdSet.add(topic_id);

                    for (const tag of tags) {
                        const tcmd = `CALL InsertTag(${topic_id}, "${tag}");`;
                        qcmd += tcmd;
                    }
    
                    for (const room of rooms) {
                        const rcmd = `CALL InsertRoom(${topic_id}, "${room}");`;
                        qcmd += rcmd;
                    }
                }
            } catch (err) {
                continue;
            }
        }

        try {
            // console.log('query: ' + qcmd);
            const result = await con.query(qcmd);
            // console.log(result);
        } catch (err) {
            console.error(err);
        }

        data = [];
        rl.resume();
    });

    let countLine = 0;
    rl.on('line', async function(line) {
        if (countLine >= 10000) {
            rl.pause();
            countLine = 0;
        }
        countLine++;

        data.push(line);
    });

    // await con.end();
})();