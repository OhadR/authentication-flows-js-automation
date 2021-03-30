import { binding, given, then, when} from 'cucumber-tsflow';
var debug = require('debug')('timeout-steps');

@binding()
export class TimeoutSteps {

    static async sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    //10 minutes is the timeout. undefined is for tags.
    @when('wait {int} minutes', undefined, 10 * 60 * 1000)
    public async waitNMinutes(numMinutes: number) {
        debug(`waiting ${numMinutes} minutes... `, new Date().toUTCString());

        await TimeoutSteps.sleep(numMinutes * 60);
        console.log("one minute has elapsed");
    }

}


