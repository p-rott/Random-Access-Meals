import React, { Component } from "react";
import Popup from "reactjs-popup";
import ChatWindow from "../components/chatwindow";
import chat from "../images/baseline-chat-24px.svg";
import ApiManager from "../js/ApiManager";
import io from "socket.io-client";

class Chat extends Component {
    state = {
        res: null
    };

    componentDidMount() {
        let am = new ApiManager("http://localhost:5000/api");

        am.get("messages")
            .then(res => this.setState({ res: res.body.messages }))
            .catch(console.log);

        var socket = io.connect("http://localhost:5000");
        socket.on("connect", function(data) {
            socket.emit("join", "Hello World from client");
        });

        //TODO: dunno how to do this rn
        socket.on("message", msg => {
            console.log(this.state.res);
            this.setState({ res: this.state.res.concat([msg]) });
            console.log(this.state.res);
        });

        /*setInterval(() => {
            am.initialize(() => {
                am.get("messages")
                    .then(res => this.setState({ res }))
                    .catch(console.log);
            }).catch(console.log);
        }, 1000);*/
    }

    render() {
        //return <img src={chat} alt="Chat" className="center" />;
        return (
            <Popup
                trigger={
                    <button className="center" style={{ border: "none", backgroundColor: "transparent" }}>
                        <img src={chat} alt="Chat" className="center" />
                    </button>
                }
                position="top center"
                closeOnDocumentClick
            >
                <ChatWindow messages={this.state.res != null ? this.state.res : []} onSendMessage={this.sendMessage} />
            </Popup>
        );
    }

    setMessage = message => {
        console.log(message);
    };

    sendMessage = msg => {
        let am = new ApiManager("http://localhost:5000/api");

        //console.log(msg);
        am.post("messages", msg)
            .then(res => console.log(res))
            .catch(console.log);
    };
}

export default Chat;
