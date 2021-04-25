import { binding, when} from 'cucumber-tsflow';
var debug = require('debug')('timeout-steps');

@binding()
export class TimeoutSteps {

    static async sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    //10 minutes is the timeout. undefined is for tags.
    @when('wait {int} seconds', undefined, 10 * 60 * 1000)
    public async waitNSeconds(numSeconds: number) {
        debug(`waiting ${numSeconds} seconds... `, new Date().toUTCString());
        await TimeoutSteps.sleep(numSeconds);
    }

}


