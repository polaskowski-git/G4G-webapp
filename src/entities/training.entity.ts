import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Generated, OneToMany } from "typeorm";
import { ApiModel } from "swagger-express-ts";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";
import Round from "./round.entity";
import { ApiModelProperty } from "../constants/decorators";

@Entity({
	name: "trainings"
})
@ApiModel({
	name: Training.NAME
})
export default class Training extends BaseEntity<Training> {
	public static readonly NAME = "Training";
	
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	@ApiModelProperty({
		required: true,
		type: "number"
	})
	id: number;

	@ManyToOne(() => User, u => u.trainings)
	@JoinColumn({ name: "user_id" })
    user: User;

	@OneToMany(
		() => Round,
		c => c.training
	)
	@ApiModelProperty({
		required: true,
		type: "array",
		model: Round.NAME
	})
	rounds: Promise<Round[]>;
    
	@Column("varchar", { length: 255 })
	@ApiModelProperty({
		required: true,
		type: "string"
	})
	name: string;
    
	@Column("datetime")
	@ApiModelProperty({
		required: true,
		type: "string"
	})
	startDateTime: Date;
    
	@Column("datetime", { nullable: true })
	@ApiModelProperty({
		required: false,
		type: "string"
	})
	endDateTime?: Date;
    
	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "number"
	})
	earnedXp: number;

}
