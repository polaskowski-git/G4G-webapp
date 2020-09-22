import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import Level from "../entities/level.entity";

@injectable()
export default class LevelRepository extends BaseRepository<Level> {
	public init() {
		this.repository = this._databaseProvider.getRepository(Level);
	}
}
