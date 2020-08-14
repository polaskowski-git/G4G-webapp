import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import Shot from "../entities/shot.entity";

@injectable()
export default class ShotRepository extends BaseRepository<Shot> {
	public init() {
		this.repository = this._databaseProvider.getRepository(Shot);
	}
}
