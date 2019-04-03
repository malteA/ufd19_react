import React, {Component} from "react";
import "./chat.css";
import { Paper, SnackbarContent, Icon, IconButton, InputBase } from "@material-ui/core";
import { Send } from "@material-ui/icons";

interface State {
    message: string;
    messages: any[];
    history: any[];
}
export default class Chat extends Component<any, State> {

    private ws: WebSocket;

    public constructor(prop: any) {
        super(prop);
        this.state = {
            message: "",
            messages: [],
            history: []
        }

        this.ws = this.registerWebsocket();
    }
    
    public async componentDidMount(): Promise<void> {
        // this.ws.onmessage = (event: MessageEvent) => {
        //     const evt: any = JSON.parse(event.data);
        //     const messages: string[] = this.state.messages;
        //     if (evt.type === "history") {
        //         return this.setState({history: evt.data});
        //     }
        //     messages.push(evt);
        //     this.setState({messages}, () => {
        //         const scrollHeight: number = document.body.scrollHeight;
        //         window.scrollTo(0, scrollHeight);
        //     })
        // }
    }

    public render(): JSX.Element {
        return(
            <div className="material-chat">
                <div>
                    {this.state.messages && this.state.messages.map((message, key) => {
                        return <SnackbarContent
                            key={key}
                            className={`chat ${message.author === "-1" ? "" : "right"}`}
                            aria-describedby="client-snackbar"
                            message={
                                <span id="client-snackbar" className="message">
                                    {message.data}
                                </span>
                            } />
                    })}
                </div>
                <div className="compose-message">
                    <Paper>
                        <InputBase
                            placeholder="message"
                            multiline={false}
                            onChange={this.handleChangeMessage}
                            onKeyPress={this.handleMessageEnter}
                            value={this.state.message}
                            className="text-field" />
                        <IconButton
                            className="send-blue"
                            aria-label="send"
                            onClick={this.handleSendMessage}>
                            <Send />
                        </IconButton>
                    </Paper>
                </div>
            </div>
        )
    }

    private handleChangeMessage = (evt: React.ChangeEvent<any>) => {
        this.setState({message: evt.target.value});
    }

    private handleMessageEnter = (evt: any) => {
        if (evt.charCode === 13) {
            this.handleSendMessage();
        }
    }

    private handleSendMessage = () => {
        const inputText: string = this.state.message.trim();
        const messages: string[] = this.state.messages;
        if (!inputText) {
            this.setState({message: ""})
            return;
        }
        const message: any = {type: "message", data: inputText, author: "1"};
        this.ws.send(inputText);
        messages.push(message);
        this.setState({messages, message: ""})
    }

    private registerWebsocket = (): WebSocket => {
        let protocol: string = 'ws://';
        if (window.location.protocol === 'https:') {
            protocol = 'wss://';
        }
        
        const webSocket: WebSocket = new WebSocket(`${protocol}${window.location.hostname}/wss`);
        
        webSocket.onmessage = (event: MessageEvent) => {
            const evt: any = JSON.parse(event.data);
            const messages: string[] = this.state.messages;
            if (evt.type === "history") {
                return this.setState({history: evt.data});
            }
            messages.push(evt);
            this.setState({messages}, () => {
                const scrollHeight: number = document.body.scrollHeight;
                window.scrollTo(0, scrollHeight);
            })
        };

        webSocket.onclose = () => setTimeout(() => this.ws = this.registerWebsocket(), 500);

        return webSocket;
    }
}