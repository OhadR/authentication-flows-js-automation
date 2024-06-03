const axios = require('axios');
const debug = require('debug')('flows-api');

// const urlPrefix = "http://localhost:3000/";
const urlPrefix = "https://auth-flows-js-demo.appspot.com/";

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
                data: 'OK',
            };
        } catch (error) {
            //debug('error.response', error.response);
            return {
                status: error.response.status,
                data: error.response.headers.err_msg,
            }
        }
    }

    public static async getLinkForUser(username: string) {

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
                urlPrefix + 'aa/' + url);
            debug('activateAccount() response.data:', response.data);
            return {
                status: response.status,
                data: 'OK',
            }
        } catch (error) {
            debug('error.response', error.response);
            return {
                status: error.response.status,
                data: error.response.headers.err_msg,
            }
        }
    }

    public static async restorePassword(url: string) {
        try {
            const response = await axios.get(
                urlPrefix + 'rp/' + url);
            debug('restorePassword() response.data:', response.data);
            return {
                status: response.status,
                data: 'OK',
            }
        } catch (error) {
            debug('error.response', error.response.status, error.response.headers.err_msg);
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
            //console.error(error);
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
                data: 'OK',
            };
        } catch (error) {
            //debug('error.response', error.response);
            return {
                status: error.response.status,
                data: error.response.headers.err_msg,
            }
        }
    }

    public static async logout(username: string) {
        try {
            const response = await axios.get(urlPrefix + 'logout');

            debug('logout() response.data:', response.data);
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

    static async forgotPassword(email: string) {
        try {
            const response = await axios.post(
                urlPrefix + 'forgotPassword',
                {
                    email
                });
            debug('forgotPassword() response.status: ' + response.status);
            return {
                status: response.status,
                data: 'OK',
            };
        } catch (error) {
            return {
                status: error.response.status,
                data: error.response.headers.err_msg,
            }
        }
    }

    static async setNewPassword(enc: string, password: string, retypedPassword: string) {
        try {
            const response = await axios.post(
                urlPrefix + 'setNewPassword',
                {
                    enc,
                    password,
                    retypedPassword
                });
            debug('setNewPassword() response.status: ' + response.status);
            return {
                status: response.status,
                data: 'OK',
            };
        } catch (error) {
            return {
                status: error.response.status,
                data: error.response.headers.err_msg,
            }
        }
    }
}