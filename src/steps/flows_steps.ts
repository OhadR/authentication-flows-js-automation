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

        /**
         * rename layer. get the assetId by the 'testName' (as it differ among envs)
         * @param testName
         * @param dataType
         * @param newName
         */
        @given(/update layer for test (.*) and dataTypes (.*) for key (.*) to value (.*) is called and return status (\d+) and return message (.*)/)
        public async updateLayer(testName: string,
                                 dataType: string,
                                 key: string,
                                 newValue: string,
                                 expectedStatus: number,
                                 returnMessage: string) {
                debug('updateLayer()');
                const testData: EnvironmentTestData = getTestDataByTestName(testName);
                expect(testData).not.to.be.undefined;

                const layerId = testData.assetId + '-' + dataType;

                const retVal = await FlowsApi.updateLayer(layerId, key, newValue);
                expect(retVal).not.to.be.undefined;
                debug(retVal);
                // debug('retVal.status', retVal.status, typeof retVal.status);
                // debug('expectedStatus', expectedStatus, typeof expectedStatus);
                expect(retVal.status).to.equal(expectedStatus);
                expect(retVal.data).to.include(returnMessage);
        }

        @when(/delete layer for test (.*) and dataTypes (.*) is called/)
        public async deleteLayer(testName: string, dataType: string) {
                debug('deleteLayer()');
                const testData: EnvironmentTestData = getTestDataByTestName(testName);
                expect(testData).not.to.be.undefined;

                const layerId = testData.assetId + '-' + dataType;

                await this.deleteLayerByLayerId(layerId);
        }

        /**
         * call deleteLayers() and validate the retVal equals the workspaceId.
         * @param layerId
         */
        @when(/delete layer with id (.*) is called/)
        public async deleteLayerByLayerId(layerId: string) {
                debug('deleteLayerByLayerId() ', layerId);

                const retVal = await FlowsApi.deleteLayer(layerId);
                expect(retVal).not.to.be.undefined;
                this.retVal = retVal;

        }
}
