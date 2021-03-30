import { binding, given, then, when, after} from 'cucumber-tsflow';
import { FlowsApi } from '../api_objects/flows_api';
import { EnvironmentTestData, getTestDataByTestName, Globals } from "../config/global";
var debug = require('debug')('datalake-steps');
const expect = require('chai').expect;
import { v4 as uuidv4 } from 'uuid';
import { Lay } from "../types/asset.type";

@binding([Globals])
export class DatalakeSteps {
        constructor(protected globals: Globals) {}

        private layers: Lay[];
        private workspaceId: string;
        private retVal: object;

        @after()
        public async afterScenario() {
                debug('afterScenario()', this.workspaceId);
                //delete the workspace:
//                await FlowsApi.deleteWorkspace(this.workspaceId);
        }


        @given(/create account with username (.*) password (.*) retyped password (.*) is called/)
        public async createAccountIsCalled(username: string,
                                           password: string,
                                           repassword: string) {
                debug('createAccountIsCalled()');
                this.layers = await FlowsApi.createAccount(username, password, repassword);
                // debug('getLayers response: ', this.layers);
                expect(this.layers).not.to.be.undefined;
        }
        @given(/get layers is called/)
        public async getLayersIsCalled() {
                debug('getLayersIsCalled()');
                this.layers = await FlowsApi.getLayers();
               // debug('getLayers response: ', this.layers);
                expect(this.layers).not.to.be.undefined;
        }

        /**
         *
         * @param optional
         * @param testName
         * @param dataTypesStr string that represents array-of-strings: can be 'DSM,POINT_CLOUD' or just 'DSM' so in any case we split it.
         */
        @given(/layers exist for test (.*) and dataTypes (.*)/)
        public async layersExists(testName: string, dataTypesStr: string) {
                const testData: EnvironmentTestData = getTestDataByTestName(testName);
                expect(testData).not.to.be.undefined;

                const dataTypes: string[] = dataTypesStr.split(',');
                for(const dataType of dataTypes) {
                        let found: boolean = false;
                        const expectedLayerId = testData.assetId + '-' + dataType;
                        debug('searching for expected layer id: ', expectedLayerId);

                        //search among all layers for the expected layer name:
                        for(const layer of this.layers) {
                                if(expectedLayerId.toUpperCase() == layer.id.toUpperCase()) {
                                        debug('found expected layer! ', expectedLayerId);
                                        found = true;
                                        break;
                                }
                        }
                        expect(found).to.be.true;
                }

        }

        @given(/layers with key (.*) and value (.*) exist for test (.*) and dataTypes (.*)/)
        public async layerExistsWithName(key: string, value: string,
                                         testName: string, dataType: string) {
                const testData: EnvironmentTestData = getTestDataByTestName(testName);
                expect(testData).not.to.be.undefined;

                const expectedLayerId = testData.assetId + '-' + dataType;
                debug('searching for expected layer id: ', expectedLayerId);

                //search among all layers for the expected layer name:
                for(const layer of this.layers) {
                        if(expectedLayerId == layer.id) {
                                debug('found expected layer!');
                                expect(layer.metadata[key]).to.equal(value);
                                return;
                        }
                }
                //we did not find the layer:
                expect.fail();
        }

        @given(/layer not exist for test (.*) and dataType (.*)/)
        public async layerNotExists(testName: string, dataType: string) {
                const testData: EnvironmentTestData = getTestDataByTestName(testName);
                expect(testData).not.to.be.undefined;

                const expectedLayerId = testData.assetId + '-' + dataType;
                debug('searching for expected layer id: ', expectedLayerId);

                //search among all layers for the expected layer name:
                for(const layer of this.layers) {
                        if(expectedLayerId == layer.id) {
                                debug('ERROR: found layer id that was removed');
                                expect.fail();
                        }
                }
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

        @then('return value of delete Layer was the workspaceId')
        public async validateRetValForDeleteLayer() {
                debug(this.retVal);
                expect(this.retVal).to.have.lengthOf(1);
                expect(this.retVal).to.include(this.workspaceId);
        }
}
