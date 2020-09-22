import { Request, Response } from "express";
import { controller, httpGet, httpPost, request, response } from "inversify-express-utils";

import BaseController from "./base.controller";
import { inject } from "inversify";
import { MailerService } from "../services/mailer.service";

@controller("/contact")
export default class ContactController extends BaseController {
	constructor(@inject(MailerService) private _mailerService: MailerService) {
		super();
	}

	@httpGet("/")
	public contact(req: Request, res: Response) {

		return this.render(res, "contact.html.twig");
	}
	
	@httpPost("/")
	public sendMessage(@request() req: Request, @response() res: Response) {
		const data = JSON.parse('{"' + decodeURI(decodeURIComponent(req.body.data).replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
		
		this._mailerService.sendMail({
			to: data["email"],
			subject: data["subject"],
			text: data["message"],
		});
		
		return res.redirect(301, "/");
	}
}
