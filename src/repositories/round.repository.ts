import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import Round from "../entities/round.entity";

@injectable()
export default class RoundRepository extends BaseRepository<Round> {
	public init() {
		this.repository = this._databaseProvider.getRepository(Round);
	}
}
