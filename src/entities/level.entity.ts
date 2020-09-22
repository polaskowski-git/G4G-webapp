import { Entity, Column, PrimaryColumn, Generated, OneToMany } from "typeorm";
import { ApiModel } from "swagger-express-ts";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";
import { ApiModelProperty } from "../constants/decorators";

@Entity({
	name: "levels"
})
@ApiModel({
	name: Level.NAME
})
export default class Level extends BaseEntity<Level> {
	public static readonly NAME = "Level";
	
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	@ApiModelProperty({
		required: false,
		type: "integer"
	})
	id: number;

	@OneToMany(
		() => User,
		c => c.level
	)
	users: Promise<User[]>;

	@Column("varchar", { length: 64 })
	@ApiModelProperty({
		required: true,
		type: "string"
	})
	title: string;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	lowXpTreshold: number;

	@Column("int", { nullable: true })
	@ApiModelProperty({
		required: false,
		type: "integer"
	})
	highXpTreshold?: number;

	public toJSON() {
		return {
			id: this.id,
			title: this.title,
			lowXpTreshold: this.lowXpTreshold,
			highXpTreshold: this.highXpTreshold
		};
	}
}
