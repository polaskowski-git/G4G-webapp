import sha1 from "sha1";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Generated, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { ApiModel } from "swagger-express-ts";

import { CONFIG } from "../constants/configs";
import { BaseEntity } from "./base.entity";
import Level from "./level.entity";
import Achievement from "./achievement.entity";
import Training from "./training.entity";
import { ApiModelProperty } from "../constants/decorators";
import UserToken from "./userToken.entity";

@Entity({
	name: "users"
})
@ApiModel({
	name: User.NAME
})
export default class User extends BaseEntity<User> {
	public static readonly NAME = "User";
	
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	@ApiModelProperty({
		required: false,
		type: "integer"
	})
	id: number;

	@ManyToOne(() => Level)
	@JoinColumn({ name: "level_id" })
	@ApiModelProperty({
		required: false,
		model: Level.NAME
	})
    level: Promise<Level>;
    
    @ManyToMany(() => Achievement)
    @JoinTable({ name: "users_achievements"})
	@ApiModelProperty({
		required: false,
		type: "array",
		model: "Achievement"
	})
    achievements: Promise<Achievement[]>

	@OneToMany(
		() => Training,
		c => c.user
	)
	trainings: Promise<Training[]>;

	@OneToMany(
		() => UserToken,
		c => c.user
	)
	tokens: Promise<UserToken[]>;

	@Column("varchar", { length: 64 })
	@ApiModelProperty({
		required: true,
		type: "string"
	})
	username: string;

	@Column("varchar", { length: 255 })
	@ApiModelProperty({
		required: true,
		type: "string"
	})
	email: string;

	@Column("varchar", { length: 64 })
	password: string;

	@Column("varchar", { length: 255, nullable: true })
	@ApiModelProperty({
		required: false,
		type: "string"
	})
	avatar?: string;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	streak: number = 0;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	xpPoints: number = 0;
	
	public async toJSON(): Promise<unknown> {
		const achievements = (await this.achievements) || [];
		const level = await this.level;

		return {
			id: this.id,
			username: this.username,
			email: this.email,
			achievements: await Promise.all(achievements.map(a => a.toJSON())),
			streak: this.streak,
			xpPoints: this.xpPoints,
			avatar: this.avatar || CONFIG.DEFAULTS.AVATAR,
			level: level ? await level.toJSON() : null
		};
	}

	public verifyPassword(password: string) {
		return this.password == sha1(password);
	}
}
