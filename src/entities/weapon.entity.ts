import { Entity, Column, PrimaryColumn, Generated } from "typeorm";
import { ApiModel } from "swagger-express-ts";

import { BaseEntity } from "./base.entity";
import { ApiModelProperty } from "../constants/decorators";

@Entity({
	name: "weapons"
})
@ApiModel({
	name: Weapon.NAME
})
export default class Weapon extends BaseEntity<Weapon> {
	public static readonly NAME = "Weapon";
	
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	@ApiModelProperty({
		required: false,
		type: "integer"
	})
	id: number;

	@Column("varchar", { length: 255 })
	@ApiModelProperty({
		required: true,
		type: "string"
	})
	model: string;

	@Column("int")
	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	magazineSize: number;

	@Column("decimal", { precision: 10, scale: 2 })
	@ApiModelProperty({
		required: true,
		type: "number"
	})
	caliberSize: number;

	public toJSON() {
		return {
			id: this.id,
			model: this.model,
			magazineSize: this.magazineSize,
			caliberSize: this.caliberSize
		};
	}
}
