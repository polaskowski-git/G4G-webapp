import { Request, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";

import BaseController from "./base.controller";
import { authorize } from "../middlewares/auth.handler";

@controller("/security")
export default class SecurityController extends BaseController {
	@httpGet("/login")
	public login(req: Request, res: Response) {
		return this.render(res, "auth/login.html.twig", {
			error: req.flash("error")
		});
	}

	@httpPost("/login", authorize)
	public loginCheck(req: Request, res: Response) {
		return res.redirect('/');
	}
}
