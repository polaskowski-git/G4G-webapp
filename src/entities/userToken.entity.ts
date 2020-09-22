import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Generated, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { ApiModel } from "swagger-express-ts";
import { v4 as uuidv4 } from 'uuid';

import { BaseEntity } from "./base.entity";
import { ApiModelProperty } from "../constants/decorators";
import User from "./user.entity";

@Entity({
	name: "users_tokens"
})
@ApiModel({
	name: UserToken.NAME
})
export default class UserToken extends BaseEntity<UserToken> {
	public static readonly NAME = "UserToken";
	
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	id: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "user_id" })
    user: Promise<User>;
    
	@Column("varchar", { length: 127 })
	@ApiModelProperty({
		required: false,
		type: "string"
	})
	token: string;

	@Column("datetime")
	@ApiModelProperty({
		required: false,
		type: "string"
	})
	expirationDate: Date;

	constructor(options: Partial<UserToken>) {
		const dateWeekAgo = new Date();
		dateWeekAgo.setDate(dateWeekAgo.getDate() + 365);

		super({
			token: uuidv4(),
			expirationDate: dateWeekAgo,
			...options
		});
	}

	public toJSON(): unknown {
		return {
			token: this.token,
			expirationDate: this.expirationDate
		}
	}
}
