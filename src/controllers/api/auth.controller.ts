import { Request, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { ApiPath, ApiOperationGet, ApiOperationPost } from "swagger-express-ts";
import { inject } from "inversify";

import BaseController from "../base.controller";
import { authorizeApi } from "../../middlewares/auth.handler";
import UserToken from "../../entities/userToken.entity";
import User from "../../entities/user.entity";
import UserTokenRepository from "../../repositories/userToken.repository";

@ApiPath({
	path: "/auth",
	name: "Auth"
})
@controller("/api/auth")
export default class AuthController extends BaseController {
    constructor(@inject(UserTokenRepository) private _userTokenRepository: UserTokenRepository) {
        super();
    }
	@ApiOperationPost({
		path: "/login",
		parameters: {
			body: {
				properties: {
					username: { type: "string" },
					password: { type: "string" }
				}
			}
		},
		summary: "Generate auth token",
		responses: {
			200: { model: UserToken.NAME },
			401: {}
		}
	})
	@httpPost("/login", authorizeApi)
	public async loginCheck(req: Request, res: Response) {
		const user = req["user"];

		const token = new UserToken({
			user: Promise.resolve(user as User)
		});

		await this._userTokenRepository.create(token);

        res.json(await token.toJSON());
	}
}
