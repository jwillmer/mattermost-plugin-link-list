import {Client4} from 'mattermost-redux/client';
import {ClientError} from 'mattermost-redux/client/client4';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {id as pluginId} from 'manifest';
import ActionTypes from 'action_types';

export const doFetch = async (url, options) => {
    const {data} = await doFetchWithResponse(url, options);

    return data;
};

export const doFetchWithResponse = async (url, options = {}) => {
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

export const getPluginServerRoute = (state) => {
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
    return async (dispatch, getState) => {
        let data;
        const baseUrl = getPluginServerRoute(getState());
        try {
            data = await doFetch(`${baseUrl}/api/v2/settingsinfo`, {
                method: 'get',
            });

            dispatch({
                type: ActionTypes.RECEIVED_PLUGIN_SETTINGS,
                data,
            });
        } catch (error) {
            return {error};
        }

        return data;
    };
}