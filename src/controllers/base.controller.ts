import { injectable } from "inversify";
import * as express from "express";
import { BaseHttpController } from "inversify-express-utils";
import { promisify } from "util";

@injectable()
export default abstract class BaseController extends BaseHttpController {
	public render(res: express.Response, template: string, options = {}): Promise<string> {
		return promisify<string, {}, string>(res.render).bind(res)(template, options);
	}
}
