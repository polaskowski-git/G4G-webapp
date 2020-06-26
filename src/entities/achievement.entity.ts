import { Entity, Column, PrimaryColumn, Generated, OneToMany, ManyToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";

@Entity({
	name: "achievements"
})
export default class Achievement extends BaseEntity<Achievement> {
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	id: number;

    @ManyToMany(() => User)
    users: Promise<User[]>

	@Column("varchar", { length: 255 })
	name: string;

	@Column("varchar", { length: 255 })
	icon: string;
}
