import { Entity, Column, PrimaryColumn, Generated, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ApiModel } from "swagger-express-ts";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";
import Round from "./round.entity";
import { ApiModelProperty } from "../constants/decorators";

@Entity({
	name: "shots"
})
@ApiModel({
	name: Shot.NAME
})
export default class Shot extends BaseEntity<Shot> {
	public static readonly NAME = "Shot";
	
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	@ApiModelProperty({
		required: false,
		type: "integer"
	})
	id: number;

	@ManyToOne(() => Round, u => u.shots)
	@JoinColumn({ name: "round_id" })
    round: Promise<Round>;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	coordinates_x: number;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	coordinates_y: number;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	points: number;

	public toJSON() {
		return {
			id: this.id,
			coordinates_x: this.coordinates_x,
			coordinates_y: this.coordinates_y,
			points: this.points
		};
	}
}
