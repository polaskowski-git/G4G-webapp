import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import Training from "../entities/training.entity";

@injectable()
export default class TrainingRepository extends BaseRepository<Training> {
	public init() {
		this.repository = this._databaseProvider.getRepository(Training);
	}
}
