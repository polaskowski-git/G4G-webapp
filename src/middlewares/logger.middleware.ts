import { Request, Response } from "express";

export const loggerMiddleware = (req: Request, resp: Response, next) => {
	console.log(`Request logged: ${req.method} ${req.path}`);
	next();
};
