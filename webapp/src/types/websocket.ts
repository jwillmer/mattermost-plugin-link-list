
import {id} from 'manifest';

import {PluginSettings} from './config';

export const WEBSOCKET_SETTINGS_UPDATED = `custom_${id}_settings_updated`;

export interface WebSocketMessageSettingsUpdated {
    data: PluginSettings
}
