import { ApiModel } from "swagger-express-ts";
import { IsOptional, IsString, IsEmail } from "class-validator";
import { ApiModelProperty } from "../constants/decorators";
import { BaseModel } from "./base.model";


@ApiModel({
	name: ProfileUpdateModel.NAME
})
export class ProfileUpdateModel extends BaseModel<ProfileUpdateModel> {
	public static readonly NAME = "ProfileUpdateModel";

	@ApiModelProperty({
		required: false,
		type: "string"
	})
	@IsString()
	@IsOptional()
    username?: string;

	@ApiModelProperty({
		required: false,
		type: "string"
	})
	@IsEmail()
	@IsOptional()
    email?: string;

	@ApiModelProperty({
		required: false,
		type: "string"
	})
	@IsString()
	@IsOptional()
    password?: string;

	@ApiModelProperty({
		required: false,
		type: "string"
	})
	@IsString()
	@IsOptional()
    avatar?: string;
}
@ApiModel({
	name: UserModel.NAME
})
export class UserModel extends BaseModel<UserModel> {
	public static readonly NAME = "UserModel";

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	@IsString()
    username: string;

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	@IsEmail()
    email: string;

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	@IsString()
    password: string;

	@ApiModelProperty({
		required: true,
		type: "string"
	})
	@IsString()
    repeatPassword: string;
}