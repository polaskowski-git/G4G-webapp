import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Generated, OneToMany } from "typeorm";
import { ApiModel } from "swagger-express-ts";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";
import Round from "./round.entity";
import { ApiModelProperty } from "../constants/decorators";
import { TrainingModel } from "../models/training.models";

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
		required: false,
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

	public async toJSON() {
		const rounds = (await this.rounds) || [];
		
		let avgAccuracy = 0, avgPrecision = 0, sumPoints = 0;
		if (rounds.length) {
			for (const round of rounds) {
				avgAccuracy += parseFloat(round.accuracy+"") || 0;
				avgPrecision += parseFloat(round.precision+"") || 0;
				sumPoints += parseInt(round.points+"") || 0;
			}

			avgAccuracy /= rounds.length;
			avgPrecision /= rounds.length;
		}

		return {
			id: this.id,
			rounds: await Promise.all(rounds.map(async r => await r.toJSON())),
			name: this.name,
			startDateTime: this.startDateTime,
			endDateTime: this.endDateTime,
			earnedXp: this.earnedXp,
			avgAccuracy,
			avgPrecision,
			sumPoints
		};
	}
}
