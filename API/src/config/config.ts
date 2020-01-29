import * as path from "path"
import * as convict from "convict"

var config = convict(__dirname +'/convict.json')
if (config.get('env') === 'dev') {
    process.chdir('src')
}
const DBConf = require(__dirname + "/db." + config.get('env') + '.json');

config.set('db', DBConf);

module.exports = config