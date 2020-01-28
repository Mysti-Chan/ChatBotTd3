/**
 * @author DE BRUYNE Alexis
 * Last Update: 12/18/2019
 */
const Config = require("./config/config");

import { Server } from "./server";

const server = new Server("127.0.0.1",3000,Config.get("db"));
server.start();