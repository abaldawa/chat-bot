import React, {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../store";
import {chatsReceived, getUserName, setUserName} from "../actions/chatActions";
import {isAlreadySubscribed, sendChatMessage, subscribeToChatBroadcast} from "../socket/socketIOCient";
import '../../index.css';

function App() {
    const
        { state = {}, dispatch } = useContext(ApplicationContext),
        {userName, chats} = state,
        [typedChatMsg, setTypedChatMsg] = useState(""),
        [typedUserName, setTypedUserName] = useState("");

    function handleSendChatMessageClick(event) {
        event.preventDefault();

        sendChatMessage( {
            userName,
            message: typedChatMsg
        } );
        setTypedChatMsg("");
    }

    function handleSetUserNameClick() {
        setUserName( dispatch, typedUserName);
    }

    useEffect(() => {
        if( !userName ) {
           const sessionUser =  getUserName();

           if( sessionUser ) {
               setUserName(dispatch, sessionUser);
           }
        }
    }, []);

    if( !isAlreadySubscribed() ) {
        subscribeToChatBroadcast( chatsArr => {
            chatsReceived( dispatch, chatsArr )
        });
    }

    return (
        <>
            <input
                type="text"
                disabled={userName}
                value={userName || typedUserName}
                onChange={(e) => setTypedUserName(e.target.value)} />
            <button
                disabled={userName || !typedUserName}
                onClick={handleSetUserNameClick}>
                Set a username
            </button>
            <ul id="messages">
                {
                    chats.map( chatObj => {
                        return (
                            <li><span>{chatObj.userName}:</span>{chatObj.message}</li>
                        );
                    } )
                }
            </ul>
            <form>
                <input
                    type="text"
                    disabled={!userName}
                    value={typedChatMsg}
                    onChange={(e) => setTypedChatMsg(e.target.value)} />
                <button
                    disabled={!userName || !typedChatMsg}
                    onClick={handleSendChatMessageClick}>
                    Send
                </button>
            </form>
        </>
    );
}

export default App;