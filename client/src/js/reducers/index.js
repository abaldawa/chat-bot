import {CHATS_RECEIVED, USERNAME_SET} from '../constants/action-types';

function reducer(state, action) {
    switch (action.type) {
        case CHATS_RECEIVED:
            return { ...state, chats: [...state.chats, ...action.payload] };
        case USERNAME_SET:
            return {...state, userName: action.payload};
        default:
            return state;
    }
}

export default reducer;