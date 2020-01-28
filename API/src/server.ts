import * as express from "express";
import * as bodyParser from "body-parser";
import * as glob from "glob";
import * as path from "path";
import * as consolidate from "consolidate"
import * as cors from "cors"
import { createConnection, Connection } from 'typeorm';
import { SocketServer } from "./SocketServer";



export class Server{

    private host: string;
    private port: number;
    private app: express.Application;
    private dataBaseConfig: any;
    private botName: string;
    private socketioServer: SocketServer;


    constructor(host: string, port: number, dataBaseConfig: any){
        this.host = host;
        this.port = port;
        this.dataBaseConfig = dataBaseConfig;
        this.app = express();
        this.socketioServer = new SocketServer(this.app, "PoulpyLePetitSquid")

        this.app.engine('html', consolidate['mustache']);
        this.app.set('view engine', 'html');
        // Set views path, template engine and default layout
        this.app.set('views', __dirname + '/templates');


        this.app.use(bodyParser.json({
            limit: '50mb',
        }));
        this.app.use(cors());
        this.app.options('*', cors());

        this.setRoute();
        this.setSocket();
    }

    private setSocket(){
        
    }

    private setRoute(){
        glob.sync('./routes/*.routes.*s').forEach(route => {
            console.log("route ok")
            require(path.resolve(route))(this.app);
        });
    }

    start(){
        createConnection(this.dataBaseConfig).then((connection: Connection) => {
            this.socketioServer.listen(3010,() => {
                console.log(`socket started on port ${this.host}:3010.`);
            });
            this.app.listen(this.port, () => {
                console.log(`db Connected on ${this.dataBaseConfig.host}:${this.dataBaseConfig.port}`);
                console.log(`Server started on port ${this.host}:${this.port}.`);
            });
        });

    }

}
