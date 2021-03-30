import { binding, given, then, when} from 'cucumber-tsflow';
import { UsersApi } from '../api_objects/users_api';
import { Globals } from "../config/global";
var debug = require('debug')('user-steps');
const expect = require('chai').expect;

@binding([Globals])
export class UserSteps {
        constructor(protected globals: Globals) {}

        @given('user log-in with username and password of environment')
        public async givenUserLogin() {
            //read credentials from environment:
                const idToken = await UsersApi.login();
                expect(idToken).not.to.be.undefined;
                // debug(idToken);
                Globals.g_idToken = idToken;
        }

        @given(/get current userId/)
        public async getWorkspaceIdFromUserDetails() {
                const userDetails = await UsersApi.getUserDetails();
                expect(userDetails).not.to.be.undefined;
                debug(userDetails);
                debug('userDetails.userId: ' + userDetails.userId);
                this.globals.g_userId = userDetails.userId;
        }
}