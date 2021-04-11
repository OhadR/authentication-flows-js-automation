import { binding, given, then, when, after} from 'cucumber-tsflow';
import { FlowsApi } from '../api_objects/flows_api';
var debug = require('debug')('flows-steps');
const expect = require('chai').expect;
import { ReturnStatus } from "../types/asset.type";

@binding()
export class DatalakeSteps {
        constructor() {}

        private retVal: ReturnStatus;
        private activationUrl: string;
        private username: string;
        private password: string;

        @after()
        public async afterScenario() {
                debug('afterScenario()');
                //delete the account:
                if(!this.username || !this.password)
                        return;

                await FlowsApi.deleteAccount(this.username, this.password);
        }


        @given(/create account with username (.*) password (.*) retyped password (.*) is called/)
        public async createAccountIsCalled(username: string,
                                           password: string,
                                           repassword: string) {
                debug('createAccountIsCalled()');
                this.retVal = await FlowsApi.createAccount(username, password, repassword);
                expect(this.retVal).not.to.be.undefined;
                debug(this.retVal);
                this.username = username;
                this.password = password;
        }


        @then(/return status (\d+) and return message (.*)/)
        public async getLayersIsCalled(status: number, returnMessage: string) {
                expect(this.retVal.status).to.equal(status);
//TODO                expect(this.retVal.data).to.include(returnMessage);
        }


        @when(/get link for username (.*) is called/)
        public async getLinkForUsername(username: string) {
                debug('getLinkForUsername()');
                const linkData: { link: string; date: Date } = await FlowsApi.getLinkForUser(username);
                this.activationUrl = linkData.link;
                debug(this.activationUrl);
        }

        @when(/activate account with link is called/)
        public async activateAccountForUsername() {
                debug('activateAccountForUsername()');
                this.retVal = await FlowsApi.activateAccount(this.activationUrl);
                expect(this.retVal).not.to.be.undefined;
                debug(this.retVal);
        }


        @when(/reset password with link is called/)
        public async resetPasswordLinkClicked() {
                debug('resetPasswordLinkClicked()');
                this.retVal = await FlowsApi.restorePassword(this.activationUrl);
                expect(this.retVal).not.to.be.undefined;
                debug(this.retVal);
        }

        @when(/login with username (.*) password (.*) is called/)
        public async loginStep(
            username: string,
            password: string) {
                debug('loginStep()');
                //delete the account:
                this.retVal = await FlowsApi.login(username, password);
                expect(this.retVal).not.to.be.undefined;
                debug(this.retVal);
        }


        @when(/forgot password for username (.*) is called/)
        public async forgotPasswordIsCalled(username: string) {
                debug('forgotPasswordIsCalled()');
                this.retVal = await FlowsApi.forgotPassword(username);
                expect(this.retVal).not.to.be.undefined;
                debug(this.retVal);
        }

        @given(/set new password with password (.*) retyped password (.*) is called/)
        public async setNewPasswordIsCalled(password: string,
                                           repassword: string) {
                debug('setNewPasswordIsCalled()');
                this.retVal = await FlowsApi.setNewPassword(this.activationUrl, password, repassword);
                expect(this.retVal).not.to.be.undefined;
                debug(this.retVal);
                if(this.retVal.status == 200)
                    this.password = password;
        }

}
