import {AnyAction, combineReducers} from 'redux';

import ActionTypes from 'action_types';

function pluginSettings(state = null, action: AnyAction) {
    switch (action.type) {
    case ActionTypes.RECEIVED_PLUGIN_SETTINGS:
        return action.data;
    default:
        return state;
    }
}

export default combineReducers({
    pluginSettings,
});
