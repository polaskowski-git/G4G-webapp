import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Generated, ManyToMany, JoinTable, OneToMany } from "typeorm";

import { CONFIG } from "../constants/configs";
import { BaseEntity } from "./base.entity";
import Level from "./level.entity";
import Achievement from "./achievement.entity";
import Training from "./training.entity";
// import { UserInfo } from "../models/UserInfo";

@Entity({
	name: "users"
})
export default class User extends BaseEntity<User> {
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	id: number;

	@ManyToOne(() => Level, { eager: true })
	@JoinColumn({ name: "level_id" })
    level: Level;
    
    @ManyToMany(() => Achievement)
    @JoinTable()
    achievments: Promise<Achievement[]>

	@OneToMany(
		() => Training,
		c => c.user
	)
	trainings: Promise<Training[]>;

	@Column("varchar", { length: 64 })
	username: string;

	@Column("varchar", { length: 255 })
	email: string;

	@Column("varchar", { length: 64 })
	password: string;

	@Column("varchar", { length: 255, nullable: true })
	avatar?: string;

	@Column("int")
	streak: number = 0;

	@Column("int")
	xpPoints: number = 0;
	
	public async getUserInfo(): Promise<unknown> {
		return {
			id: this.id,
			username: this.username,
			email: this.email,
			streak: this.streak,
			xpPoints: this.xpPoints,
			avatar: this.avatar || CONFIG.DEFAULTS.AVATAR
		};
	}
}
