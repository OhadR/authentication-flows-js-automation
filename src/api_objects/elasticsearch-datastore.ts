import {Client as ElasticClient} from "elasticsearch";
import { Globals } from "../config/global";
import { Ass } from "../types/asset.type";
const debug = require('debug')('elastic');

const ASSETS_INDEX: string = 'assets';

const matchAllQuery = {
    query: {
        match_all: {}
    }
};

const simpleQuery = {
    query: {
        term: { 'assetId': '' }
    }
};

const boolQuery = {
    query: {
        bool: {
            filter: [
                {                term: { 'metadata.p1': 'MTohad' }            },
                {                term: { 'metadata.p2': 'MTredlich' }         }
            ],
        }
    }
};

export class ElasticsearchDatastore {

    private static _instance: ElasticsearchDatastore;
    protected _elasticClient: ElasticClient;

    private constructor() {

        const url = Globals.g_envConfig.elasticsearchUrl;
        debug(`ElasticsearchDatastore: URL = ${Globals.g_envConfig.elasticsearchUrl}`);

        this._elasticClient = new ElasticClient({
            host: url,
            log: 'info',
            apiVersion: '7.1' // use the same version of your Elasticsearch instance
        });

    }

    public static get instance() {
        if( !ElasticsearchDatastore._instance )
            ElasticsearchDatastore._instance = new ElasticsearchDatastore();

        return ElasticsearchDatastore._instance;
    }


    public async assetExists(assetId: string): Promise<boolean> {
        if (!assetId) {
            return Promise.reject();
        }
        let response;
        try {
            response = await this._elasticClient.exists({
                index: ASSETS_INDEX,
                id: assetId
            });
        } catch (error) {
            return Promise.reject();
        }
        return Promise.resolve(response);
    }

    public async getAsset(assetId: string): Promise<Ass> {
        if (!assetId) {
            return Promise.reject();
        }

        try {
            const response = await this._elasticClient.get({
                index: ASSETS_INDEX,
                id: assetId
            });
            //debug('response: ', response);
            return response._source;
        } catch (error) {
            debug(error);
            return null;
        }
    }

    public async updateAsset(assetId: string, body: object): Promise<string> {
        let response;
        debug(body);

        try {
            response = await this._elasticClient.update({
                index: ASSETS_INDEX,
                id: assetId,
                body: { doc: body }
            });
        } catch (error) {
            debug(error);
            return Promise.reject(error);
        }
        debug('response', response);
        return Promise.resolve(response.result);    //result should be 'updated'
    }

    public async deleteAsset(assetId: string): Promise<string> {
        let response;

        try {
            response = await this._elasticClient.delete({
                index: ASSETS_INDEX,
                id: assetId
            });
        } catch (error) {
            debug(error);
            return Promise.reject(error);
        }
        debug('response', response);
        return Promise.resolve(response.result);    //result should be 'updated'
    }

    /**
     * used for REPLACE. UPDATE does not delete fields from the doc, it only updates the given fields.
     * @param assetId
     * @param body
     */
    public async indexAsset(assetId: string, body: object): Promise<string> {
        let response;
        //debug(body);

        try {
            response = await this._elasticClient.index({
                index: ASSETS_INDEX,
                id: assetId,
                body: body
            });
        } catch (error) {
            debug(error);
            return Promise.reject(error);
        }
        debug('response', response);
        return Promise.resolve(response.result);    //result should be 'updated'
    }

    public async getLayersByOwner(ownerId: string): Promise<object[]> {
        if (!ownerId) {
            return Promise.reject();
        }

        debug(`ElasticsearchDatastore.getLayersByOwner: Retrieving layers for ownerId '${ownerId}'`);
        let hits: object[];


        try {
            const response = await this._elasticClient.search({
                index: ASSETS_INDEX,
                size: 5000,
//                body: boolGeoQuery
                body: matchAllQuery
            });
            hits = response?.hits?.hits;
        } catch (error) {
            debug(error);
            return Promise.reject();
        }

        debug(`Successfully retrieved ${hits.length} hits for workorder id '${ownerId}'`);
        return Promise.resolve(hits);
    }
}