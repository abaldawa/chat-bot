import SocketIoClient from "socket.io-client";
import {chatSend, chatBroadcast} from "../../../../common/socketEvents";

let
    socket;

/**
 * @public
 *
 * This function creates socket connection with the server and
 * subscribes to chat broadcast event.
 *
 * @param {function} callback - Notify the via callback the new received chat messages
 */
function subscribeToChatBroadcast( callback ) {
    socket = SocketIoClient();

    socket.on( chatBroadcast.eventName, (chatsArr) => {
        callback(chatsArr);
    } );
}

/**
 * @public
 *
 * Sends chat message object to websocket server
 *
 * @param {Object} msgObj
 *   @param {string} msgObj.userName
 *   @param {string} msgObj.message
 */
function sendChatMessage( msgObj ) {
    socket.emit( chatSend.eventName, msgObj );
}

function unsubscribeFromChatRoom() {
    socket && socket.close();
    socket = null;
}

/**
 * @public
 *
 * Returns whether socket is already connected to the server.
 *
 * @returns {boolean}
 */
function isAlreadySubscribed() {
    return !!socket;
}

export {
    subscribeToChatBroadcast,
    sendChatMessage,
    isAlreadySubscribed
};