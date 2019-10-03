
import {USERNAME_SET, CHATS_RECEIVED} from '../constants/action-types';

const
    addUsername = userName => ({type: USERNAME_SET, payload: userName}),
    addChats = chatsArr => ({type: CHATS_RECEIVED, payload: chatsArr}),
    USERNAME_SESSION_KEY = "chat_username";

function browserHasLocalStorage() {
    return typeof localStorage !== "undefined";
}

function chatsReceived( dispatch, chatsArr ) {
    dispatch( addChats(chatsArr) );
}

function setUserName( dispatch, userName ) {
    if( browserHasLocalStorage() ) {
        localStorage.setItem( USERNAME_SESSION_KEY, userName );
    }

    dispatch( addUsername(userName) );
}

function getUserName() {
    if( browserHasLocalStorage() ) {
        return localStorage.getItem( USERNAME_SESSION_KEY );
    }

    return "";
}

export {
    chatsReceived,
    setUserName,
    getUserName
}