import { ApiModel } from "swagger-express-ts";
import { IsDateString, IsOptional, IsInt, IsString, IsNotEmpty, ArrayNotEmpty, ValidateNested } from "class-validator";
import { RoundModel } from "./round.models";
import { ApiModelProperty } from "../constants/decorators";
import { BaseModel } from "./base.model";
import Round from "../entities/round.entity";

@ApiModel({
	name: TrainingModel.NAME
})
export class TrainingModel extends BaseModel<TrainingModel> {
	public static readonly NAME = "TrainingModel";

	@ApiModelProperty({
		required: true,
		type: "array",
		model: RoundModel.NAME
	})
	@ArrayNotEmpty()
    @ValidateNested()
    rounds: RoundModel[];

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	@IsString()
	@IsNotEmpty()
    name: string;

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	@IsDateString()
    startDateTime: string;

	@ApiModelProperty({
		required: false,
		type: "string"
	})
	@IsDateString()
	@IsOptional()
    endDateTime?: string;

	@ApiModelProperty({
		required: true,
		type: "integer"
	})
	@IsInt()
	earnedXp: number;
	
	public build(options: Partial<TrainingModel>) {
		super.build(options);

		this.rounds = options.rounds.map(r => new RoundModel(r));
	}
}

@ApiModel({
	name: TrainingUpdateModel.NAME
})
export class TrainingUpdateModel extends BaseModel<TrainingUpdateModel> {
	public static readonly NAME = "TrainingUpdateModel";

	@ApiModelProperty({
		required: false,
		type: "string"
	})
	@IsString()
	@IsOptional()
    name?: string;

	@ApiModelProperty({
		required: false,
		type: "string"
	})
	@IsDateString()
	@IsOptional()
    startDateTime?: string;

	@ApiModelProperty({
		required: false,
		type: "string"
	})
	@IsDateString()
	@IsOptional()
    endDateTime?: string;

	@ApiModelProperty({
		required: false,
		type: "integer"
	})
	@IsInt()
	@IsOptional()
	earnedXp?: number;
}