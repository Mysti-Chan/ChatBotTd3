import { Application } from "express-serve-static-core";
import {Request, Response} from "express";
import * as https from "https";
import { IncomingMessage } from "http";
import { PersonMiddleware } from "../middleware/person.middleware";

module.exports = function(app: Application){
    
    app.route("/people")
    .get(PersonMiddleware.getList)
    .post(
        PersonMiddleware.getDepName,
        PersonMiddleware.save
        );

    app.route("/people/:id")
    .get(PersonMiddleware.get)
    .delete(PersonMiddleware.delete)
    .put(PersonMiddleware.update)
}