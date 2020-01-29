/**
 * @author DE BRUYNE Alexis
 * Last Update: 12/18/2019
 */
const Config = require("./config/config");

import { Server } from "./server";

const server = new Server(
    process.env["IP"],
    Number.parseInt(process.env["PORT"]),
    Config.get("db"));
server.start();