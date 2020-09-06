import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import User from "../entities/user.entity";
import {UserModel} from "../models/user.models";
import { RankingElementModel } from "../models/rankings.models";

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

    public async findOneByUsernameOrEmail(usernameOrEmail: string) {
        return await this.repository
            .createQueryBuilder("u")
            .select("u")
            .where("u.username = :usernameOrEmail", { usernameOrEmail })
            .orWhere("u.email = :usernameOrEmail", { usernameOrEmail })
            .getOne();
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

    public async getAchievementRankingList(limit: number = 5)
    {
        return await this.repository
            .createQueryBuilder('u')
            .select('u.username', 'username')
            .addSelect('u.xpPoints', 'score')
            .orderBy('u.xpPoints', 'DESC')
            .limit(limit)
            .getRawMany()
    }

    public async getRankingByXpPoints(limit: number = 5): Promise<RankingElementModel[]>
    {
        return await this.repository.query(UserRepository.getRankingByXpPointsSQL(limit))
    }

    public async getRankByXpPointsOfUser(user: User): Promise<RankingElementModel>
    {
        return (await this.repository.query(UserRepository.getRankingByXpPointsSQL(1, `id = ${user.id}`)))[0] ?? null;
    }

    private static getRankingByXpPointsSQL(limit?: number, where?: string): string {
        return `SELECT 
            username, 
            xpPoints as score, 
            FIND_IN_SET( xpPoints, (
                SELECT 
                    GROUP_CONCAT( xpPoints ORDER BY xpPoints DESC ) 
                FROM users )
            ) AS rank
            FROM users
            ${where ? ` WHERE ${where}` : ""}
            ORDER BY rank ASC
            ${limit ? ` LIMIT ${limit}` : ""}`;
    }

    public async getRankingByAccuracy(limit: number = 5): Promise<RankingElementModel[]>
    {
        return await this.repository.query(UserRepository.getRankingByAccuracySQL(limit))
    }

    public async getRankByAccuracyOfUser(user: User): Promise<RankingElementModel>
    {
        return (await this.repository.query(UserRepository.getRankingByAccuracySQL(null, `u.id = ${user.id}`)))[0] ?? null;
    }

    private static getRankingByAccuracySQL(limit?: number, where?: string): string {
        return `SELECT 
            u.username, 
            NVL(avg(r.accuracy),0) as score, 
            FIND_IN_SET( NVL(avg(r.accuracy),'0.00000000'), CONCAT((
                SELECT GROUP_CONCAT( sc.score ORDER BY sc.score DESC) FROM ( SELECT u1.id, avg(r1.accuracy) as score FROM users u1 LEFT JOIN trainings t1 ON u1.id = t1.user_id LEFT JOIN rounds r1 ON t1.id = r1.training_id GROUP BY u1.id ) as sc
            ), ',0.00000000')) AS rank
            FROM users u
            LEFT JOIN trainings t ON u.id = t.user_id
            LEFT JOIN rounds r ON t.id = r.training_id
            ${where ? ` WHERE ${where}` : ""}
            GROUP BY u.id
            ORDER BY rank ASC
            ${limit ? ` LIMIT ${limit}` : ""}`;
    }
}
