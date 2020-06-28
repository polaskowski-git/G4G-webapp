import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import User from "../entities/user.entity";

@injectable()
export default class UserRepository extends BaseRepository<User> {
	public init() {
		this.repository = this._databaseProvider.getRepository(User);
	}

    public async findOneByUsername(username: string) {
        return this.repository.findOne({
            where: {
                username: username
            }
        })
    }
}
