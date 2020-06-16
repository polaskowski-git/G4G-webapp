import { ValidationError } from "class-validator";

export class NotFoundException extends Error {}
export class InternalServerErrorException extends Error {}
export class BadRequestException extends Error {}
export class ForbiddenException extends Error {}

export class ValidationException extends BadRequestException {
	constructor(public errors: ValidationError[]) {
		super();
	}
}
