import * as express from "express";
import * as i18n from "i18n";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import { join } from "path";
import cors from "cors";
import * as swagger from "swagger-express-ts";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { Application } from "express";
import { InversifyExpressServer, BaseMiddleware } from "inversify-express-utils";
import { Container } from "inversify";
import { NextHandleFunction } from "connect";
import { CONFIG } from "./constants/configs";
import { Lang } from "./constants/enums";
import errorHandler from "./middlewares/error.handler";
import BaseSubscriber from "./subscribers/base.subscriber";
import DatabaseProvider from "./services/database.provider";
import UserRepository from "./repositories/user.repository";
import User from "./entities/user.entity";

class App {
	private static readonly SECURITY_HEADER_KEY = "X-API-Key";
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
			this.sessions();
			this.passport();
			this.cors();
			this.middlewares(appInit.middleWares);
			this.assets();
			this.translations();
			this.template();
			this.swagger();
		});
		this.server.build();
	}
	
	private async database(): Promise<void> {
		await this.container.get(DatabaseProvider).createConnection();
	}
	
	private swagger(): void {
		this.app.use("/dev/swagger/assets", express.static("node_modules/swagger-ui-dist"));
		this.app.use(
			swagger.express({
				path: "/dev/swagger.json",
				definition: {
					basePath: "/api",
					info: {
						title: CONFIG.APPLICATION.NAME,
						version: CONFIG.APPLICATION.VERSION
					},
					schemes: [CONFIG.HTTP_PROTOCOL],
					securityDefinitions: {
						APIKeyHeader: {
							type: "apiKey",
							in: "header",
							name: App.SECURITY_HEADER_KEY
						}
					}
				}
			})
		);
	}
	
	private sessions(): void {
		this.app.use(session({
			secret: CONFIG.SERVER.SECRET,
			resave: false,
			saveUninitialized: true
		}));
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

	private passport(): void {
		const _userRepository = this.container.get(UserRepository);
		passport.use(new Strategy(
			function(username, password, done) {
				_userRepository.findOneByUsername(username).then(user => {
					if (!user) { return done(null, false); }
					if (!user.verifyPassword(password)) { return done(null, false); }
					return done(null, user);
				}).catch(err => done(err));
			}
		));

		passport.use(new HeaderAPIKeyStrategy(
			{ header: App.SECURITY_HEADER_KEY, prefix: "" },
			false,
			function(apiKey, done) {
				_userRepository.findOneByToken(apiKey).then(user => {
					if (!user) { return done(null, false); }
					return done(null, user);
				}).catch(err => done(err));
			}
		));

		passport.serializeUser(function(user: User, done) {
			done(null, user.id);
		});
		   
		passport.deserializeUser(function(id: number, done) {
			_userRepository.findOne(id).then(user => {
				done(null, user);
			}).catch(err => done(err));
		});

		this.app.use(passport.initialize());
		this.app.use(passport.session());
	}

	public getContainer(): Container {
		return this.container;
	}

	public getApp(): Application {
		return this.app;
	}
}

export default App;
