import { binding, given, then, when, after} from 'cucumber-tsflow';
import { FlowsApi } from '../api_objects/flows_api';
import { EnvironmentTestData, getTestDataByTestName, Globals } from "../config/global";
var debug = require('debug')('flows-steps');
const expect = require('chai').expect;
import { v4 as uuidv4 } from 'uuid';
import { ReturnStatus } from "../types/asset.type";

@binding([Globals])
export class DatalakeSteps {
        constructor(protected globals: Globals) {}

        private retVal: ReturnStatus;

        @after()
        public async afterScenario() {
                debug('afterScenario()');
                //delete the workspace:
//                await FlowsApi.deleteWorkspace(this.workspaceId);
        }


        @given(/create account with username (.*) password (.*) retyped password (.*) is called/)
        public async createAccountIsCalled(username: string,
                                           password: string,
                                           repassword: string) {
                debug('createAccountIsCalled()');
                this.retVal = await FlowsApi.createAccount(username, password, repassword);
                expect(this.retVal).not.to.be.undefined;
                debug(this.retVal);
        }


        @then(/return status (\d+) and return message (.*)/)
        public async getLayersIsCalled(status: number, returnMessage: string) {
                expect(this.retVal.status).to.equal(status);
//TODO                expect(this.retVal.data).to.include(returnMessage);
        }


        @when(/activate account for username (.*) is called/)
        public async activateAccountForUsername(username: string) {
                debug('activateAccountForUsername()');
                const activationUrl = await FlowsApi.getActivationLinkForUser(username);
                debug(activationUrl);
                await FlowsApi.activateAccount(activationUrl);

        }
}
