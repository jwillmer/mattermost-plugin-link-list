import {Store} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {id as pluginId} from 'manifest';
import Reducer from 'reducers';
import {getSettings, handleWebsocketSettingsUpdated} from 'actions';

import {WEBSOCKET_SETTINGS_UPDATED} from 'types/websocket';
import type {PluginSettings} from 'types/config';

// eslint-disable-next-line import/no-unresolved
import type {PluginRegistry} from 'types/mattermost-webapp';

import {MainMenuMobileIcon} from './components/icons';

export const isNullOrWhitespace = (input:string) => {
    return !input || !input.trim();
};

export const setMainMenuItems = (registry:PluginRegistry, settings: PluginSettings) => {
    setMainMenuItem(registry, 1, settings.Site1Title, settings.Site1Url);
    setMainMenuItem(registry, 2, settings.Site2Title, settings.Site2Url);
    setMainMenuItem(registry, 3, settings.Site3Title, settings.Site3Url);
    setMainMenuItem(registry, 4, settings.Site4Title, settings.Site4Url);
    setMainMenuItem(registry, 5, settings.Site5Title, settings.Site5Url);
};

export const setMainMenuItem = (registry:PluginRegistry, number:number, title:string, url:string) => {
    if (!isNullOrWhitespace(title) && !isNullOrWhitespace(url)) {
        registry.registerMainMenuAction(
            <FormattedMessage
                id={pluginId + '_site_' + number}
                defaultMessage={title}
            />,
            () => {
                window.open(url, '_blank');
            },
            <MainMenuMobileIcon/>,
        );
    }
};

export default class Plugin {
    public async initialize(registry: PluginRegistry, store: Store<GlobalState>) {
        registry.registerReducer(Reducer);

        const settings = await getSettings()(store.dispatch, store.getState);

        setMainMenuItems(registry, settings);

        registry.registerWebSocketEventHandler(WEBSOCKET_SETTINGS_UPDATED, handleWebsocketSettingsUpdated(store.getState, store.dispatch));
    }
}

declare global {
    interface Window {
        registerPlugin(id: string, plugin: Plugin): void
    }
}

window.registerPlugin(pluginId, new Plugin());
