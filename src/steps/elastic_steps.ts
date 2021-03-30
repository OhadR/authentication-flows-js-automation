import { binding, given, then, when} from 'cucumber-tsflow';
import { ElasticsearchDatastore } from "../api_objects/elasticsearch-datastore";
import { EnvironmentTestData, getTestDataByTestName, Globals } from "../config/global";
import * as path from "path";
import { Ass } from "../types/asset.type";
import { TimeoutSteps } from "./timeout_steps_v4";
var debug = require('debug')('elastic-steps');
const expect = require('chai').expect;

@binding()
export class ElasticSteps {

    @given(/asset for test (.*) exists in elastic/)
    public async assetExistsInElastic(testName: string) {
        const testData: EnvironmentTestData = getTestDataByTestName(testName);
        expect(testData).not.to.be.undefined;

        const exists: boolean = await ElasticsearchDatastore.instance.assetExists(testData.assetId);
        expect(exists).to.be.true;
    }

    /**
     * this method get assetId and updates it in ES from a hard-coded json file in the project.
     * @param assetId
     */
    @given(/update metadata of asset (after tiling )?for test (.*) in elastic/)
    public async updateAssetInElastic(isAfterTiling: boolean, testName: string) {
        const testData: EnvironmentTestData = getTestDataByTestName(testName);
        expect(testData).not.to.be.undefined;

        const fileNameSuffix = isAfterTiling? '.afterTiling' : '.beforeTiling';
        //get the body according to assetId:
        const pathToOriginalBody = path.join(
            '..',
            'resources',
            Globals.g_envConfig.configId,
            testData.assetId + fileNameSuffix + '.json');
        debug('$$$ ' + pathToOriginalBody);
        const originalBody = require(pathToOriginalBody);
        debug('originalBody:', originalBody);

        const result: string = await ElasticsearchDatastore.instance.indexAsset(testData.assetId, originalBody);
        debug('result:', result);
        // 'noop' is also valid ES-resopnse, in case of no change in data:
        expect(result).to.be.oneOf(['updated', 'noop']);
    }

    @given(/set asset for test (.*) in elastic to be PREMIUM/)
    public async setAssetToPremium(testName: string) {
        const testData: EnvironmentTestData = getTestDataByTestName(testName);
        expect(testData).not.to.be.undefined;

        const result: string = await ElasticsearchDatastore.instance.updateAsset(testData.assetId, {
            metadata: {
                premium: true
            },
        });
        debug('result:', result);
        expect(result).to.equal('updated');
    }



    @then(/metadata of asset for test (.*) is updated with fields (.*) in elastic/)
    public async validateMetadataUpdatedForAsset(testName: string, fieldsToCheckStr: string) {
        const testData: EnvironmentTestData = getTestDataByTestName(testName);
        expect(testData).not.to.be.undefined;

        const result: Ass = await ElasticsearchDatastore.instance.getAsset(testData.assetId);
        debug('result:', result);
        const fieldsToCheck: string[] = fieldsToCheckStr.split(',');
        for(const field of fieldsToCheck) {
            debug('checking field ', field, result.metadata[field]);
            expect(result.metadata[field]).not.to.be.undefined;
        }
    }

    //10 minutes is the timeout. undefined is for tags.
    @then(/wait for status completed for test (.*)/, undefined, 10 * 60 * 1000)
    public async waitForCompletion(testName: string) {

        const testData: EnvironmentTestData = getTestDataByTestName(testName);
        expect(testData).not.to.be.undefined;

        const numSeconds = 15;
        let repeat = true;

        while(repeat) {
            const result: Ass = await ElasticsearchDatastore.instance.getAsset(testData.assetId);
            debug('checking field dataTypes: ', result.metadata['dataTypes']);

            repeat = false;

            if( !result.metadata['dataTypes'] ) {
                debug(`dataTypes does not exist; waiting ${numSeconds} seconds... `, new Date().toUTCString());
                await TimeoutSteps.sleep(numSeconds );
                repeat = true;
            }
            else if( !result.metadata['dataTypes'].length ) {
                debug(`dataTypes exists but empty; waiting ${numSeconds} seconds... `, new Date().toUTCString());
                await TimeoutSteps.sleep(numSeconds );
                repeat = true;
            }
        }
    }
}
