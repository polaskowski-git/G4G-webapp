import { injectable } from "inversify";
import * as express from "express";
import { BaseHttpController } from "inversify-express-utils";
import { promisify } from "util";

@injectable()
export default abstract class BaseController extends BaseHttpController {
	public render(res: express.Response, template: string, options = {}): Promise<string> {
		const defaultsOptions = {
			app: {
				user: res.req.user
			}
		};
		return promisify<string, {}, string>(res.render).bind(res)(template, { ...defaultsOptions, ...options });
	}
}
