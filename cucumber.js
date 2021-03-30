//the runner file to run cucumber.
let common = [
    'src/features/**/*.feature', // Specify our feature files
    '--require-module ts-node/register', // Load TypeScript module
    '--require src/config/**/*.ts', // config
    '--require src/steps/**/*.ts', // Load step definitions
    //'--require src/configurations/**/*.js', // world
    '--format progress-bar', // Load custom formatter
    '--publish', // publish report
    //'--world-parameters {"env":"not-needed"}',
    '--tags @ohads',
].join(' ');

module.exports = {
  default: common
};