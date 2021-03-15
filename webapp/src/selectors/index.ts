import {GlobalState} from 'mattermost-redux/types/store';

import {id as pluginId} from 'manifest';
import {PluginSettings} from 'types/config';

//@ts-ignore GlobalState is not complete
const getPluginState = (state: GlobalState) => state['plugins-' + pluginId] || {};

export const getPluginSettings = (state: GlobalState): PluginSettings => getPluginState(state).pluginSettings;
