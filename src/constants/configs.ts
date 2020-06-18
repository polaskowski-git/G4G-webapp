import { resolve } from "path";
import { ConnectionOptions } from "typeorm";
import { ConfigUtil } from "../utils/config.util";

export class CONFIG {
	public static NODE_ENV = process.env["NODE_ENV"] || "dev";

	public static APPLICATION = {
		NAME: process.env["APPLICATION.NAME"] || "Application",
		VERSION: process.env["APPLICATION.VERSION"] || "1.0.0"
	};

	public static SERVER = {
		DOMAIN: process.env["SERVER.DOMAIN"] || "localhost",
		PORT: Number(process.env["SERVER.PORT"]) || 3000,
		SSL_ENABLED: Boolean(process.env["SERVER.SSL_ENABLED"]) || false,
		CERT_PATH: process.env["SERVER.CERT_PATH"] || "",
		CERT_KEY_PATH: process.env["SERVER.CERT_KEY_PATH"] || "",
		CORS_ENABLED: Boolean(process.env["SERVER.CORS_ENABLED"]) || false
	};

	public static DATABASE = {
		HOST: process.env["DATABASE.HOST"] || "",
		DATABASE: process.env["DATABASE.DATABASE"] || "",
		PORT: Number(process.env["DATABASE.DATABASE"]) || 3306,
		USERNAME: process.env["DATABASE.USERNAME"] || "",
		PASSWORD: process.env["DATABASE.PASSWORD"] || ""
	};

    public static DEFAULTS = {
		AVATAR: process.env["DEFAULTS.AVATAR"] || "/assets/img/defaultAvatar.jpg"
	};

	public static get HTTP_PROTOCOL(): "http" | "https" {
		return CONFIG.SERVER.SSL_ENABLED ? "https" : "http";
	}

	public static get TYPEORM() {
		return {
			type: "mariadb",
			host: CONFIG.DATABASE.HOST,
			port: CONFIG.DATABASE.PORT,
			username: CONFIG.DATABASE.USERNAME,
			password: CONFIG.DATABASE.PASSWORD,
			database: CONFIG.DATABASE.DATABASE,
			entities: [resolve(__dirname, "../**/entities/*")],
			migrations: [resolve(__dirname, "../**/migrations/*")],
			migrationsTableName: "migrations_node",
			cli: {
				migrationsDir: "src/migrations"
			}
		} as ConnectionOptions
	}

}


