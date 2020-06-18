import { Entity, Column, PrimaryColumn, Generated, OneToMany, ManyToOne, JoinColumn } from "typeorm";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";
import Round from "./round.entity";

@Entity({
	name: "shots"
})
export default class Shot extends BaseEntity<Shot> {
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	id: number;

	@ManyToOne(() => Round, u => u.shots)
	@JoinColumn({ name: "round_id" })
    round: Promise<Round>;

	@Column("int")
	coordinates_x: number;

	@Column("int")
	coordinates_y: number;

	@Column("int")
	points: number;
}
