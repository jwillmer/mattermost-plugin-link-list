import {Store, Action} from 'redux';

import {GlobalState} from 'mattermost-redux/types/store';

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {id as pluginId} from 'manifest';
import Reducer from 'reducers';
import {getSettings} from 'actions';

// eslint-disable-next-line import/no-unresolved
import {PluginRegistry} from './types/mattermost-webapp';
import {
    MainMenuMobileIcon
} from './components/icons';

export const isNullOrWhitespace = (input) => {
    return !input || !input.trim();
}

export const setMainMenuItem = (registry, number, title, url) => {
    if(!isNullOrWhitespace(title) && !isNullOrWhitespace(url)) {
        registry.registerMainMenuAction(
            <FormattedMessage
                id= {pluginId + '_site_' + number}
                defaultMessage={title}
            />,
            () => {
                window.open(url, '_blank');
            },
            <MainMenuMobileIcon/>,
        );
    }
}

export default class Plugin {
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {    
        registry.registerReducer(Reducer);
    
        const settings = await store.dispatch(getSettings());  

        setMainMenuItem(registry, 1, settings.Site1Title, settings.Site1Url);
        setMainMenuItem(registry, 2, settings.Site2Title, settings.Site2Url);
        setMainMenuItem(registry, 3, settings.Site3Title, settings.Site3Url);
        setMainMenuItem(registry, 4, settings.Site4Title, settings.Site4Url);
        setMainMenuItem(registry, 5, settings.Site5Title, settings.Site5Url);
    }  
}

declare global {
    interface Window {
        registerPlugin(id: string, plugin: Plugin): void
    }
}

window.registerPlugin(pluginId, new Plugin());
