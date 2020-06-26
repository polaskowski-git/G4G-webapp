import { Entity, Column, PrimaryColumn, Generated } from "typeorm";

import { BaseEntity } from "./base.entity";

@Entity({
	name: "weapons"
})
export default class Weapon extends BaseEntity<Weapon> {
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	id: number;

	@Column("varchar", { length: 255 })
	model: string;

	@Column("int")
	magazineSize: number;

	@Column("decimal", { precision: 10, scale: 2 })
	caliberSize: number;
}
