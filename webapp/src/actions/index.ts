import {AnyAction, Dispatch} from 'redux';

import {GetStateFunc} from 'mattermost-redux/types/actions';
import {Client4} from 'mattermost-redux/client';
import {ClientError} from 'mattermost-redux/client/client4';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {GlobalState} from 'mattermost-redux/types/store';
import {Options} from 'mattermost-redux/types/client4';

import type {PluginSettings} from 'types/config';
import type {WebSocketMessageSettingsUpdated} from 'types/websocket';

import {id as pluginId} from 'manifest';
import ActionTypes from 'action_types';

const doFetch = async (url:string, options:Options) => {
    const {data} = await doFetchWithResponse(url, options);

    return data;
};

const doFetchWithResponse = async (url:string, options = {}) => {
    const response = await fetch(url, Client4.getOptions(options));

    let data;
    if (response.ok) {
        data = await response.json();

        return {
            response,
            data,
        };
    }

    data = await response.text();

    throw new ClientError(Client4.url, {
        message: data || '',
        status_code: response.status,
        url,
    });
};

const getPluginServerRoute = (state: GlobalState) => {
    const config = getConfig(state);

    let basePath = '';
    if (config && config.SiteURL) {
        basePath = new URL(config.SiteURL).pathname;

        if (basePath && basePath[basePath.length - 1] === '/') {
            basePath = basePath.substr(0, basePath.length - 1);
        }
    }

    return basePath + '/plugins/' + pluginId;
};

export function getSettings() {
    return async (dispatch: Dispatch<AnyAction>, getState: GetStateFunc): Promise<PluginSettings> => {
        let data;
        const baseUrl = getPluginServerRoute(getState());
        try {
            data = await doFetch(`${baseUrl}/api/v1/settings`, {
                method: 'get',
            });

            dispatch({
                type: ActionTypes.RECEIVED_PLUGIN_SETTINGS,
                data,
            });
        } catch (error) {
            console.error(error); //eslint-disable-line no-console
        }

        return data;
    };
}

export function handleWebsocketSettingsUpdated(getState: GetStateFunc, dispatch: Dispatch) {
    return (msg: WebSocketMessageSettingsUpdated): void => {
        if (!msg.data) {
            return;
        }

        const data = msg.data;

        dispatch({
            type: ActionTypes.RECEIVED_PLUGIN_SETTINGS,
            data,
        });
    };
}
