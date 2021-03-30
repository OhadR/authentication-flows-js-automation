import { Globals } from "../config/global";

const axios = require('axios');
var debug = require('debug')('flows-api');

export class FlowsApi {

    private static SERVICE_NAME = 'datalake';
    constructor() {}

    public static async createAccount(
        email: string,
        password: string,
        retypedPassword: string) {
        try {
            const response = await axios.post(
                'http://localhost:3000/createAccount',
                {
                    email,
                    password,
                    retypedPassword
                });
            debug('createAccount() response.status: ' + response.status);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            //debug('error.response', error.response);
            return {
                status: error.response.status,
                data: error.response.data.error,
            }
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
}