export class Globals {
    static g_envConfig: EnvironmentVariables;
}

interface EnvironmentVariables {
    configId: string;
    urlPrefix: string;
}