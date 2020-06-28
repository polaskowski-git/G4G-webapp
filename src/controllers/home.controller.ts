import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";

import BaseController from "./base.controller";
import { CONFIG } from "../constants/configs";

@controller("/")
export default class HomeController extends BaseController {
	@httpGet("/")
	public index(req: Request, res: Response) {
		console.log(req["user"]);
		return this.render(res, "home.html.twig", {
			app: CONFIG.APPLICATION
		});
	}
}
