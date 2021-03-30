import { binding, given, then, when, after} from 'cucumber-tsflow';
import { FlowsApi } from '../api_objects/flows_api';
import { EnvironmentTestData, getTestDataByTestName, Globals } from "../config/global";
var debug = require('debug')('datalake-steps');
const expect = require('chai').expect;
import { v4 as uuidv4 } from 'uuid';
import { UsersApi } from "../api_objects/users_api";
import { Lay, Workspace } from "../types/asset.type";

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
                await FlowsApi.deleteWorkspace(this.workspaceId);
        }


        @given(/create account is called/)
        public async createAccountIsCalled() {
                debug('createAccountIsCalled()');
                this.layers = await FlowsApi.createAccount();
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

        @when(/create workspace is called/)
        public async createWorkspaceIsCalled() {
                debug('createWorkspaceIsCalled()');
                const retVal: Workspace = await FlowsApi.createWorkspace();
                expect(retVal).not.to.be.undefined;
                debug(retVal);
                this.workspaceId = retVal.workspaceId;
        }

        @when(/delete workspace is called/)
        public async deleteWorkspaceIsCalled() {
                debug('deleteWorkspaceIsCalled()');
                await FlowsApi.deleteWorkspace(this.workspaceId);
        }


        @then(/workspace exists/)
        public async workspaceExists() {
                debug('workspaceExists()');
                const retVal : Workspace[] = await FlowsApi.getWorkspaces();
                expect(retVal).not.to.be.undefined;
                debug(retVal);
                //search among all worksapces for `this.workspaceId`:
                for(const workspace of retVal) {
                        if(workspace.workspaceId == this.workspaceId) {
                                return;
                        }
                }
                expect.fail();
        }

        @then(/workspace does not exist/)
        public async workspaceNotExist() {
                debug('workspaceNotExist()');
                const retVal : Workspace[] = await FlowsApi.getWorkspaces();
                expect(retVal).not.to.be.undefined;
                debug(retVal);
                //search among all worksapces for `this.workspaceId`:
                for(const workspace of retVal) {
                        if(workspace.workspaceId == this.workspaceId)
                                expect.fail();
                }
        }

        @given(/add layer with id (.*) to workspace/)
        public async addLayersToWorkspaceIsCalled(layerId: string) {
                debug('addLayersToWorkspaceIsCalled()');
                debug('layerId= ' + layerId);
                const retVal = await FlowsApi.addLayersToWorkspace(this.workspaceId, layerId);

                debug(retVal);
                expect(retVal).not.to.be.undefined;
                expect(retVal).to.equal('OK');
        }

        @given(/add layer with same id (.*) to workspace/)
        public async addSameLayerToWorkspaceIsCalled(layerId: string) {
                debug('addSameLayerToWorkspaceIsCalled()');
                const retVal = await FlowsApi.addLayersToWorkspace(this.workspaceId, layerId);

                debug(retVal);
                expect(retVal).not.to.be.undefined;
                expect(retVal).to.include('layerId ' + layerId + ' already exists in workspace');
        }

        @given('add layer to non-existing workspace')
        public async addLayersToNonExistingWorkspaceIsCalled() {
                debug('addLayersToNonExistingWorkspaceIsCalled()');
                const generatedLayerId = uuidv4();
                const retVal = await FlowsApi.addLayersToWorkspace(this.workspaceId + 'X', generatedLayerId);

                debug(retVal);
                expect(retVal).to.include('Error: no workspace found with id =');
        }

        @given('add layer to workspace with empty body')
        public async addLayersToWorkspaceWithEmptyBodyIsCalled() {
                debug('addLayersToWorkspaceWithEmptyBodyIsCalled()');
                const retVal = await FlowsApi.addLayersToWorkspaceEmptyBody(this.workspaceId);

                debug(retVal);
                expect(retVal).to.equal('invalid path parameters: event.body.layers');
        }

        @given('add layer without layerId to workspace')
        public async addLayerWithoutIdToWorkspaceIsCalled() {
                debug('addLayerWithoutIdToWorkspaceIsCalled()');
                const retVal = await FlowsApi.addLayersToWorkspace(this.workspaceId, null);

                debug(retVal);
                expect(retVal).not.to.be.undefined;
                expect(retVal).to.include('missing layerId in a given layer to add');
        }

        @given(/layer with id (.*) is added to workspace/)
        public async workspaceContainLayer(layerId: string) {
                debug('workspaceContainLayer()');
                const retVal = await FlowsApi.getWorkspaces();
                debug(retVal);
                expect(retVal).not.to.be.undefined;

                //search for 'layerId'
                //search among all worksapces for `this.workspaceId`:
                for(const workspace of retVal) {
                        if(workspace.workspaceId == this.workspaceId) {
                                debug('found workspaceId: ' + workspace.workspaceId);
                                for(const layer of workspace.layers) {
                                        if(layer.layerId == layerId) {
                                                debug('found layerId: ' + layer.layerId);
                                                return;
                                        }
                                }
                        }
                }
                expect.fail();
        }

        @given('nothing happens')
        public async nothingHappens() {
        }

        @given(/delete layer with id (.*) from workspace/)
        public async deleteLayerFromWorkspace(layerId: string) {
                debug('deleteLayerFromWorkspace()');
                const retVal = await FlowsApi.deleteLayersFromWorkspace(this.workspaceId, layerId);

                debug(retVal);
                expect(retVal).not.to.be.undefined;
                expect(retVal).to.equal('OK');
        }

        @given('delete layer from workspace without layers in request')
        public async deleteLayerFromWorkspaceWithoutLayers() {
                debug('deleteLayerFromWorkspaceWithoutLayers()');
                const retVal = await FlowsApi.deleteLayersFromWorkspace(this.workspaceId, null);

                debug(retVal);
                expect(retVal).not.to.be.undefined;
                expect(retVal).to.include('invalid body: expecting layers');
        }

        @given(/layer with id (.*) not exist in workspace/)
        public async workspaceNotContainLayer(layerId: string) {
                debug('workspaceNotContainLayer()');
                const retVal = await FlowsApi.getWorkspaces();
                debug(retVal);
                expect(retVal).not.to.be.undefined;

                //search for 'Globals.g_layerId'
                //search among all worksapces for `this.workspaceId`:
                for(const workspace of retVal) {
                        if(workspace.workspaceId == this.workspaceId) {
                                debug('found workspaceId: ' + workspace.workspaceId);
                                for(const layer of workspace.layers) {
                                        if(layer.layerId == layerId) {
                                                debug('found layerId: ' + layer.layerId);
                                                expect.fail();
                                        }
                                }
                                break;
                        }
                }
        }

        @given(/switch workspace is called/)
        public async switchWorkspace() {
                const userDetails = await UsersApi.switchWorkspace(this.globals.g_userId, this.workspaceId);
                expect(userDetails).not.to.be.undefined;
                debug(userDetails);
                expect(userDetails.workspaceId).to.equal(this.workspaceId);
        }

        @then(/workspaceId of current user is the new workspaceId/)
        public async workspaceIdFromUserDetailsShouldEqualNewWorkspace() {
                const userDetails = await UsersApi.getUserDetails();
                expect(userDetails).not.to.be.undefined;
                debug(userDetails);
                debug('workspaceIdOfCurrentUser: ' + userDetails.workspaceId);
                debug('this.workspaceId: ' + this.workspaceId);
                expect(userDetails.workspaceId).to.equal(this.workspaceId);
        }
}
