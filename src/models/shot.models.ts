import { ApiModel } from "swagger-express-ts";
import { ApiModelProperty } from "../constants/decorators";
import { BaseModel } from "./base.model";
import { IsInt } from "class-validator";

@ApiModel({
	name: ShotModel.NAME
})
export class ShotModel extends BaseModel<ShotModel> {
    public static readonly NAME = "ShotModel";

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	@IsInt()
    points: number;

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	@IsInt()
    coordinates_x: number;

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	@IsInt()
    coordinates_y: number;
}