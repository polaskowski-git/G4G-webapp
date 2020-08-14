import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { IsInt, IsDecimal, ValidateNested, ArrayNotEmpty, IsNumber } from "class-validator";
import { ShotModel } from "./shot.models";
import { BaseModel } from "./base.model";
import Shot from "../entities/shot.entity";

@ApiModel({
	name: RoundModel.NAME
})
export class RoundModel extends BaseModel<RoundModel> {
    public static readonly NAME = "RoundModel";

    @ApiModelProperty({
        required: true,
        type: "array",
        model: ShotModel.NAME
    })
	@ArrayNotEmpty()
    @ValidateNested()
    shots: ShotModel[];

    @ApiModelProperty({
		required: true,
		type: "integer"
	})
	@IsInt()
    weaponId: number;

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	@IsInt()
    points: number;

	@ApiModelProperty({
		required: true,
		type: "number"
	})
	@IsNumber()
    accuracy: number;

	@ApiModelProperty({
		required: true,
		type: "number"
	})
	@IsNumber()
    precision: number;

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	@IsInt()
    overallScore: number;
	
	public build(options: Partial<RoundModel>) {
		super.build(options);

		this.shots = options.shots.map(s => new Shot(s));
	}
}