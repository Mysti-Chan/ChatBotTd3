import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import { Message } from "./model/Message.model";
import { PersonModel } from "./model/Person.model";
import cons = require("consolidate");
import { Client } from "./SocketClient";

//269054958815780

export class SocketServer{

    private botName: string;
    private serverHttp: http.Server;
    private io: socketio.Server;
    private client: Client[];

    constructor(app: express.Application, name: string){
        this.botName = name;
        this.serverHttp = new http.Server(app);
        this.io = socketio(this.serverHttp, { origins: '*:*'});
        this.client = [];
        this.setFlags();
        
    }

    private setFlags(){
        this.io.on('connection',(socket) => this.client.push(new Client(socket,this.botName)));
    }

    public listen(port: number, callback: () => void){
        this.serverHttp.listen(port, callback);
    }
}