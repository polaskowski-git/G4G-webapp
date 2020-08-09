import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import UserToken from "../entities/userToken.entity";

@injectable()
export default class UserTokenRepository extends BaseRepository<UserToken> {
	public init() {
		this.repository = this._databaseProvider.getRepository(UserToken);
	}
}
