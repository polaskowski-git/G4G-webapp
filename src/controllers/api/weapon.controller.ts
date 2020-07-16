import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { ApiPath, ApiOperationGet } from "swagger-express-ts";

import BaseController from "../base.controller";
import { inject } from "inversify";
import WeaponRepository from "../../repositories/weapon.repository";
import Weapon from "../../entities/weapon.entity";

@ApiPath({
	path: "/weapons",
	name: "Weapons"
})
@controller("/api/weapons")
export default class WeaponController extends BaseController {
    constructor(@inject(WeaponRepository) private _weaponRepository: WeaponRepository) {
        super();
    }

	@ApiOperationGet({
		path: "/",
		summary: "Get weapon list",
		responses: {
			200: { type: "array", model: Weapon.NAME }
		}
	})
	@httpGet("/")
	public async list(req: Request, res: Response) {
		const weapons = await this._weaponRepository.findBy({});

        res.json(weapons.map(w => w.toJSON()));
	}
}
