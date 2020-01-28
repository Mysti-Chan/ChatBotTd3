import { Application } from "express-serve-static-core";
import {Request, Response} from "express";
import * as https from "https";
import { IncomingMessage } from "http";

module.exports = function(app: Application){
    
    app.get("/",(req: Request, res: Response) => {
        res.status(200).send("i'm alive");
    });
}