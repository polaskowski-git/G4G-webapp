import { Request, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";

import BaseController from "./base.controller";
import { authorize, checkNotAuthenticated, checkAuthenticated } from "../middlewares/auth.handler";

@controller("/")
export default class SecurityController extends BaseController {
	@httpGet("login", checkNotAuthenticated)
	public login(req: Request, res: Response) {
		return this.render(res, "security/login.html.twig", {
			messages: {
				error: req.flash("error")
			}
		});
	}

	@httpPost("login", authorize)
	public loginCheck(req: Request, res: Response) {
		return res.redirect('/dashboard');
	}

	@httpGet("logout")
	public logout(req: Request, res: Response) {
		req.logout();
		return res.redirect('/');
	}

	@httpGet("profile", checkAuthenticated)
	public profile(req: Request, res: Response) {
		return this.render(res, "security/profile.html.twig");
	}
}
