import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Generated, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { ApiModel } from "swagger-express-ts";

import { CONFIG } from "../constants/configs";
import { BaseEntity } from "./base.entity";
import Level from "./level.entity";
import Achievement from "./achievement.entity";
import Training from "./training.entity";
import { ApiModelProperty } from "../constants/decorators";

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
		required: true,
		type: "number"
	})
	id: number;

	@ManyToOne(() => Level)
	@JoinColumn({ name: "level_id" })
    level: Promise<Level>;
    
    @ManyToMany(() => Achievement)
    @JoinTable()
	@ApiModelProperty({
		required: false,
		type: "array",
		model: "Achievement"
	})
    achievments: Promise<Achievement[]>

	@OneToMany(
		() => Training,
		c => c.user
	)
	@ApiModelProperty({
		required: false,
		model: Level.NAME
	})
	trainings: Promise<Training[]>;

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
		type: "number"
	})
	streak: number = 0;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "number"
	})
	xpPoints: number = 0;
	
	public async toJSON(): Promise<unknown> {
		return {
			id: this.id,
			username: this.username,
			email: this.email,
			streak: this.streak,
			xpPoints: this.xpPoints,
			avatar: this.avatar || CONFIG.DEFAULTS.AVATAR
		};
	}

	public verifyPassword(password: string) {
		return this.password == password;
	}
}
