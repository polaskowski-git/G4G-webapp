import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import Weapon from "../entities/weapon.entity";

@injectable()
export default class WeaponRepository extends BaseRepository<Weapon> {
	public init() {
		this.repository = this._databaseProvider.getRepository(Weapon);
	}
}
