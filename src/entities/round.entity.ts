import { Entity, Column, PrimaryColumn, Generated, ManyToMany, ManyToOne, JoinColumn, OneToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import Training from "./training.entity";
import Weapon from "./weapon.entity";
import Shot from "./shot.entity";

@Entity({
	name: "rounds"
})
export default class Round extends BaseEntity<Round> {
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	id: number;

	@ManyToOne(() => Training, u => u.rounds)
	@JoinColumn({ name: "training_id" })
    training: Promise<Training>;

	@ManyToOne(() => Weapon)
	@JoinColumn({ name: "weapon_id" })
    weapon: Promise<Weapon>;

	@OneToMany(
		() => Shot,
		c => c.round
	)
	shots: Promise<Shot[]>;

	@Column("int")
	points: number;

	@Column("decimal", { precision: 10, scale: 4 })
	accuracy: number;

	@Column("decimal", { precision: 10, scale: 4 })
	precision: number;

	@Column("int")
	overallScore: number;
}
