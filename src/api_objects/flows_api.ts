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
            debug(Globals.g_envConfig.urlPrefix + 'createAccount');
            const response = await axios.post(
                Globals.g_envConfig.urlPrefix + 'createAccount',
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

    public static async getActivationLinkForUser(username: string) {

        try {
            const response = await axios.get(
                Globals.g_envConfig.urlPrefix + 'link/' + username);
            //debug('getActivationLinkForUser() response.status: ' + response.status);
            return (response.status == 200)
                ? response.data.link
                : undefined;

        } catch (error) {
            console.error(error);
        }
    }

    public static async activateAccount(url: string) {
        try {
            const response = await axios.get(
                Globals.g_envConfig.urlPrefix + 'aa?uts=' + url);
            debug('activateAccount() response.data:', response.data);
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