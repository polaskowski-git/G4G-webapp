import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";

import BaseController from "./base.controller";
import { checkAuthenticated } from "../middlewares/auth.handler";

@controller("/dashboard")
export default class DashboardController extends BaseController {
	@httpGet("/", checkAuthenticated)
	public index(req: Request, res: Response) {

		return this.render(res, "dashboard.html.twig");
	}
}
