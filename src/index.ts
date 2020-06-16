import "reflect-metadata";
import { Container } from "inversify";
import * as bodyParser from "body-parser";

import App from "./app";

import { loggerMiddleware } from "./middlewares/logger.middleware";

import { ConfigUtil } from "./utils/config.util";

import "./controllers/home.controller";

ConfigUtil.parse("./config.ini");

const container = new Container({ defaultScope: "Singleton", autoBindInjectable: true });


const app = new App(container, {
	middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true }), loggerMiddleware],
	subscribers: []
});

app.listen();

export { app };
