import { Request, Response, NextFunction } from "express";
import { NotFoundException, BadRequestException, ForbiddenException, ValidationException } from "../constants/Exceptions";
// import { ValidationError } from "../models/ValidationError";

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof NotFoundException) res.status(404).send("Not found");
	else if (err instanceof BadRequestException) {
		if (err instanceof ValidationException) {
			res.status(400).send({
				status: false,
				// errors: ValidationError.prepareInfo(err.errors)
			});
		} else {
			res.status(400).send("Bad request");
		}
	} else if (err instanceof ForbiddenException) res.status(403).send("Forbidden");
	else {
		console.error(err.stack);
		res.status(500).send("Internal server error!");
	}

	next();
};
