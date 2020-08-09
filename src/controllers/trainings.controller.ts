import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";

import BaseController from "./base.controller";
import { checkAuthenticated } from "../middlewares/auth.handler";

@controller("/trainings")
export default class TrainingsController extends BaseController {
	@httpGet("/", checkAuthenticated)
	public index(req: Request, res: Response) {

		return this.render(res, "trainings/trainings.html.twig");
	}
}
