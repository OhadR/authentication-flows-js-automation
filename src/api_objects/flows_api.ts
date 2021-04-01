const axios = require('axios');
const debug = require('debug')('flows-api');

const urlPrefix = "http://localhost:3000/";

export class FlowsApi {

    constructor() {}

    public static async createAccount(
        email: string,
        password: string,
        retypedPassword: string) {
        try {
            debug(urlPrefix + 'createAccount');
            const response = await axios.post(
                urlPrefix + 'createAccount',
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
                urlPrefix + 'link/' + username);
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
                urlPrefix + 'aa?uts=' + url);
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
                data: error.response.headers.err_msg,
            }
        }
    }

    public static async deleteAccount(username: string, password: string) {
        debug(`deleteAccount(), username: ${username}, password: ${password}`)
        try {
            const response = await axios.post(
                urlPrefix + 'deleteAccount',
                {
                    email: username,
                    password,
                });

            debug('deleteAccount() response.data:', response.data);
            return (response.status == 200)
                ? response.data
                : undefined;

        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public static async login(username: string, password: string) {
        try {
            const response = await axios.post(
                urlPrefix + 'login',
                {
                    username,
                    password,
                });

            debug('login() response.data:', response.data);
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
}