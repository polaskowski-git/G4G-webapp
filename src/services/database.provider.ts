/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import { createConnection, Connection, Repository } from "typeorm";

import { BaseRepository } from "../repositories/base.repository";
import { BaseEntity } from "../entities/base.entity";
import { ConfigTypeORM } from "../constants/configs";

@injectable()
export default class DatabaseProvider {
	public db: Connection;
	public repostitories: BaseRepository<any>[] = [];

	public async createConnection(): Promise<void> {
		this.db = await createConnection(ConfigTypeORM).catch(err => {
			console.error(err);
			return null;
		});

		// await this.db.runMigrations().catch(err => {
		// 	LogUtil.log(err);
		// 	return null;
		// });

		this.initRepositories();
	}

	public addRepostitory(repostitory: BaseRepository<any>): void {
		if (this.db) {
			repostitory.init();
		} else {
			this.repostitories.push(repostitory);
		}
	}

	public getRepository<Entity>(entity: typeof BaseEntity): Repository<Entity> {
		return this.db.getRepository<Entity>(entity);
	}

	private initRepositories() {
		this.repostitories.forEach(r => r.init());
	}
}
