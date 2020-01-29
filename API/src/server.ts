import * as express from "express";
import * as bodyParser from "body-parser";
import * as glob from "glob";
import * as path from "path";
import * as cors from "cors"
import { createConnection, Connection } from 'typeorm';
import { SocketServer } from "./SocketServer";



export class Server{

    private host: string;
    private port: number;
    private app: express.Application;
    private dataBaseConfig: any;
    private socketioServer: SocketServer;


    constructor(host: string, port: number, dataBaseConfig: any){
        this.host = host;
        this.port = port;
        this.dataBaseConfig = dataBaseConfig;
        this.app = express();
        this.socketioServer = new SocketServer(this.app, "PoulpyLePetitSquid")

        this.app.use(bodyParser.json({
            limit: '50mb',
        }));
        this.app.use(cors());
        this.app.options('*', cors());

        this.setRoute();
    }

    private setRoute(){
        glob.sync(__dirname + '/routes/*.routes.*s').forEach(route => {
            require(path.resolve(route))(this.app);
        });
    }

    start(){
        createConnection(this.dataBaseConfig).then((connection: Connection) => {
            console.log(`db Connected on ${this.dataBaseConfig.host}:${this.dataBaseConfig.port}`);
            this.socketioServer.listen(3010,() => {
                console.log(`socket started on port ${this.host}:3010.`);
            });
            this.app.listen(this.port, () => {
                console.log(`Server started on port ${this.host}:${this.port}.`);
            });
        });

    }

}
