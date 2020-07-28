import { ApiModel } from "swagger-express-ts";
import * as validator from "class-validator";
import { head, values } from "lodash";
import { BaseModel } from "./base.model";
import { ApiModelProperty } from "../constants/decorators";

@ApiModel({
	name: "ValidationError"
})
export class ValidationErrorModel extends BaseModel<ValidationErrorModel> {
	public static readonly NAME = "ValidationErrorModel";

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	public field: string;

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	public message: string;

	@ApiModelProperty({
		required: false,
		type: "array",
		model: ValidationErrorModel.NAME
	})
	public children: ValidationErrorModel[];

	public static prepareInfo(errors: validator.ValidationError[]): ValidationErrorModel[] {
		return errors.map((err: validator.ValidationError) => {
			return {
				field: err.property,
				message: head(values(err.constraints)),
				children: ValidationErrorModel.prepareInfo(err.children || [])
			} as ValidationErrorModel;
		});
	}
}
