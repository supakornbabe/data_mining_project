cd Data
sed -i '' "s/None/"'"None"'"/" ptlog_2018*
sed -i '' "s/\\\\x/\\\\\\\\x/" ptlog_2018*

mongoimport  --type json  --collection pantip --db data_mining --file ptlog_20181015.json
mongoimport  --type json  --collection pantip --db data_mining --file ptlog_20181016.json
mongoimport  --type json  --collection pantip --db data_mining --file ptlog_20181017.json
mongoimport  --type json  --collection pantip --db data_mining --file ptlog_20181018.json
mongoimport  --type json  --collection pantip --db data_mining --file ptlog_20181019.json
mongoimport  --type json  --collection pantip --db data_mining --file ptlog_20181020.json
mongoimport  --type json  --collection pantip --db data_mining --file ptlog_20181021.json