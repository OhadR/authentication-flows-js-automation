import { Globals } from "../config/global";
import { Workspace } from "../types/asset.type";

const axios = require('axios');
var debug = require('debug')('datalake-api:' + process.env.CUCUMBER_WORKER_ID);

export class DatalakeApi {

    private static SERVICE_NAME = 'datalake';
    constructor() {}

    public static async createAccount() {
        try {
            const response = await axios.post(
                'http://localhost:3000/createAccount',
                {
                    name: "automation-workspace",
                },
                {});
            debug('getLayers() response.status: ' + response.status);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            console.error(error);
        }
    }

    public static async getLayers() {

        try {
            const response = await axios.get(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + '/v1/getLayers',
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('getLayers() response.status: ' + response.status);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            console.error(error);
        }
    }

    public static async updateLayer(layerId: string, key: string, newValue: string) {
        try {
            const response = await axios.put(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + '/v1/dataLayer/' + layerId,
                {
                    [key]: newValue,
                },
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('updateLayer() response.data:', response.data);
            return {
                status: response.status,
                data: response.data,
            }
        } catch (error) {
            //in case of 401 (premium) the response.data is:
            /*{
                success: false,
                error: 'could not update layer with supplierName key as asset is PREMIUM'
            }*/
            debug('error.response', error.response);
            return {
                status: error.response.status,
                data: error.response.data.error,
            }
        }
    }

    public static async deleteLayer(layerId: string) {
        debug('deleteLayer(), layerId: ', layerId)
        try {
            const response = await axios.delete(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + '/v1/dataLayer/' + layerId,
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('deleteLayer() response.data:', response.data);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    /***********************       WORKSPACES        *****************************************************************/
    static async createWorkspace() : Promise<Workspace> {
        try {
            // debug('ohadsss@');
            // debug(Globals.g_idToken);
            const response = await axios.post(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + '/v1/workspace',
                {
                    name: "automation-workspace",
                },
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('createWorkspace() response.data:');
            debug(response.data);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    static async deleteWorkspace(workspaceId: string) : Promise<Workspace> {
        if(!workspaceId)
            return null;

        try {
            const response = await axios.delete(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + `/v1/workspace/${workspaceId}`,
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('deleteWorkspace() response.data:', response.data);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            console.error(error);
            return undefined;
        }
    }


    static async getWorkspaces(): Promise<Workspace[]> {
        try {
            const response = await axios.get(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + '/v1/workspace',
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('getWorkspaces() response.status: ' + response.status);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    static async addLayersToWorkspace(workspaceId: string, generatedLayerId: string) {
        try {
            const layer = {
                "layers": [{
                    "layerId": generatedLayerId,
                    "opacity": 0.7,
                    "color": "white",
                    "visible": true
                }]
            };
            const response = await axios.post(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + `/v1/workspace/${workspaceId}/addLayers`,
                layer,
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('addLayersToWorkspace() response.data:');
            debug(response.data);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            debug('addLayersToWorkspace() Error:');
            debug(error.response.data);
            return error.response.data.error;
        }
    }

    static async addLayersToWorkspaceEmptyBody(workspaceId: string) {
        try {
            const response = await axios.post(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + `/v1/workspace/${workspaceId}/addLayers`,
                {},
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('addLayersToWorkspaceEmptyBody() response.data:');
            debug(response.data);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            debug('addLayersToWorkspaceEmptyBody() Error:');
            debug(error.response.data);
            return error.response.data.error;
        }
    }

    static async deleteLayersFromWorkspace(workspaceId: string, layerId: string) {
        try {
            const layers = layerId ?
                {
                    "layers": [ layerId ]
                }
                : {};
            const response = await axios.put(
                Globals.g_envConfig.urlPrefix + this.SERVICE_NAME + `/v1/workspace/${workspaceId}/deleteLayers`,
                layers,
                {
                    headers: {
                        idToken: Globals.g_idToken
                    },
                });
            debug('deleteLayersFromWorkspace() response.data:');
            debug(response.data);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            debug('deleteLayersFromWorkspace() Error:');
            debug(error.response.data);
            return error.response.data.error;
        }
    }
}