import * as express from "express";
import * as i18n from "i18n";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as cors from "cors";
import { Application } from "express";
import { InversifyExpressServer, BaseMiddleware } from "inversify-express-utils";
import { Container } from "inversify";
import { NextHandleFunction } from "connect";
import { CONFIG } from "./constants/configs";
import { Lang } from "./constants/enums";
import errorHandler from "./middlewares/error.handler";
import BaseSubscriber from "./subscribers/base.subscriber";
import DatabaseProvider from "./services/database.provider";

class App {
	private app: Application;
	private server: InversifyExpressServer;
	private httpServer: http.Server;
	private container: Container;

	constructor(container: Container, appInit: { middleWares: (NextHandleFunction | BaseMiddleware)[]; subscribers: BaseSubscriber[]; }) {
		this.container = container;

		this.createApp();
		this.errorHandlers();

		this.server.setConfig(app => {
			this.app = app;
			this.cors();
			this.middlewares(appInit.middleWares);
			this.assets();
			this.translations();
			this.template();
		});
		this.server.build();
	}

	private async database(): Promise<void> {
		await this.container.get(DatabaseProvider).createConnection();
	}

	private cors(): void {
		if (CONFIG.SERVER.CORS_ENABLED) this.app.use(cors()); 
	}

	private errorHandlers(): void {
		this.server.setErrorConfig(app => {
			app.use(errorHandler);
		});
	}

	private middlewares(middleWares: (NextHandleFunction | BaseMiddleware)[]): void {
		middleWares.forEach(middleWare => {
			if (typeof middleWare === "function") this.app.use(middleWare);
		});
	}

	private translations() {
		const locales = Object.values(Lang);

		i18n.configure({
			locales: locales,
			defaultLocale: locales[0],
			objectNotation: true,
			directory: __dirname + "/../translations"
		});

		this.app.use(i18n.init);
	}

	private assets(): void {
		this.app.use(express.static("public"));
	}

	private template(): void {
		this.app.set("views", "templates");
		this.app.set("view engine", "twig");
	}

	public async listen(): Promise<void> {
		await this.createHttpServer();
		await this.database();
		await this.httpServer.listen(CONFIG.SERVER.PORT, () => {
			console.log("Server run on port " + CONFIG.SERVER.PORT);
		});
	}

	private createApp(): void {
		const router = express.Router({
			caseSensitive: false,
			mergeParams: true,
			strict: false
		});
		
		this.server = new InversifyExpressServer(this.container, router);
	}

	private createHttpServer(): void {
		if (CONFIG.SERVER.SSL_ENABLED)
			this.httpServer = https.createServer(
				{
					cert: fs.readFileSync(CONFIG.SERVER.CERT_PATH),
					key: fs.readFileSync(CONFIG.SERVER.CERT_KEY_PATH)
				},
				this.app
			);
		else this.httpServer = http.createServer(this.app);
	}

	public getContainer(): Container {
		return this.container;
	}

	public getApp(): Application {
		return this.app;
	}
}

export default App;
