import { Entity, Column, PrimaryColumn, Generated, OneToMany, ManyToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";
import { ApiModel } from "swagger-express-ts";
import { ApiModelProperty } from "../constants/decorators";

@Entity({
	name: "achievements"
})
@ApiModel({
	name: Achievement.NAME
})
export default class Achievement extends BaseEntity<Achievement> {
	public static readonly NAME = "Achievement";
	
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	@ApiModelProperty({
		required: false,
		type: "integer"
	})
	id: number;

    @ManyToMany(() => User)
    users: Promise<User[]>

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	@Column("varchar", { length: 255 })
	name: string;

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	@Column("varchar", { length: 255 })
	icon: string;

	public async toJSON() {
		return {
			id: this.id,
			name: this.name,
			icon: this.icon
		};
	}
}
