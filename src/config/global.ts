
export class Globals {
    public static g_idToken: string;
    g_userId: string;
    static g_envConfig: EnvironmentVariables;

}

export interface EnvironmentTestData {
    testName: string;
    assetId: string;
    pathToAsset: string;
    artifact: string;   //the artifacts that should be clean upon start of test
}

interface EnvironmentVariables {
    configId: string;
    urlPrefix: string;
    region: string;
    awsAccountId: string;
    username: string;
    password: string;
    accountName: string;
    bucketName: string;
    ownerId: string;
    elasticsearchUrl: string;
    credentialsPostgresName: string;
    testsData: EnvironmentTestData[];
}

export function getTestDataByTestName(testName: string): EnvironmentTestData {
    for (const testEntry of Globals.g_envConfig.testsData) {
        if (testEntry.testName === testName) {
            return testEntry;
        }
    }
    return null;
}