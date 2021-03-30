// module variables
import { Globals } from "./global";

const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
//global.gConfig = environmentConfig;
Globals.g_envConfig = environmentConfig;

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(Globals.g_envConfig)}`);