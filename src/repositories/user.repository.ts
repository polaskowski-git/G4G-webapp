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
                username
            }
        });
    }

    public async findOneByEmail(email: string) {
        return this.repository.findOne({
            where: {
                email
            }
        });
    }

    public async findOneByToken(token: string) {
        return await this.repository
            .createQueryBuilder("u")
            .select("u")
            .innerJoinAndSelect("u.tokens", "ut")
            .where("ut.expirationDate > :now", { now: new Date() })
            .andWhere("ut.token = :token", { token })
            .getOne();
    }
}
