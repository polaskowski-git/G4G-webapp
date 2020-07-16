import { Entity, Column, PrimaryColumn, Generated, ManyToMany, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ApiModel } from "swagger-express-ts";

import { BaseEntity } from "./base.entity";
import Training from "./training.entity";
import Weapon from "./weapon.entity";
import Shot from "./shot.entity";
import { ApiModelProperty } from "../constants/decorators";

@Entity({
	name: "rounds"
})
@ApiModel({
	name: Round.NAME
})
export default class Round extends BaseEntity<Round> {
	public static readonly NAME = "Round";
	
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	@ApiModelProperty({
		required: false,
		type: "integer"
	})
	id: number;

	@ManyToOne(() => Training, u => u.rounds)
	@JoinColumn({ name: "training_id" })
	// @ApiModelProperty({
	// 	required: true,
	// 	model: Training.NAME
	// })
    training: Promise<Training>;

	@ManyToOne(() => Weapon)
	@JoinColumn({ name: "weapon_id" })
	@ApiModelProperty({
		required: true,
		model: Weapon.NAME
	})
    weapon: Promise<Weapon>;

	@OneToMany(
		() => Shot,
		c => c.round
	)
	@ApiModelProperty({
		required: true,
		type: "array",
		model: Shot.NAME
	})
	shots: Promise<Shot[]>;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	points: number;

	@Column("decimal", { precision: 10, scale: 4 })
	@ApiModelProperty({
		required: true,
		type: "number"
	})
	accuracy: number;

	@Column("decimal", { precision: 10, scale: 4 })
	@ApiModelProperty({
		required: true,
		type: "number"
	})
	precision: number;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	overallScore: number;

	public async toJSON() {
		return {
			id: this.id,
			weapon: (await this.weapon).toJSON(),
			shots: (await this.shots).map(s => s.toJSON()),
			points: this.points,
			accuracy: this.accuracy,
			precision: this.precision,
			overallScore: this.overallScore
		};
	}
}
