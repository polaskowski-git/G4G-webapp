import { Entity, Column, PrimaryColumn, Generated, OneToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";

@Entity({
	name: "levels"
})
export default class Level extends BaseEntity<Level> {
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	id: number;

	@OneToMany(
		() => User,
		c => c.level
	)
	users: Promise<User[]>;

	@Column("varchar", { length: 64 })
	title: string;

	@Column("int")
	lowXpTreshold: number;

	@Column("int", { nullable: true })
	highXpTreshold?: number;
}
