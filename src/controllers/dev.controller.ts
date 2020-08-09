import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";

import BaseController from "./base.controller";
import { CONFIG } from "../constants/configs";

@controller("/dev")
export default class DevController extends BaseController {
	@httpGet("/swagger")
	public index(req: Request, res: Response) {
		return this.render(res, "dev/swagger.html.twig", {
			app: CONFIG.APPLICATION
		});
	}
}
