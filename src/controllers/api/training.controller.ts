import { inject } from "inversify";
import { Request, Response } from "express";
import { controller, httpGet, httpPost, httpPut, queryParam, request, response } from "inversify-express-utils";
import { ApiPath, ApiOperationGet, ApiOperationPost, ApiOperationPut } from "swagger-express-ts";
import { validate } from "class-validator";

import BaseController from "../base.controller";
import TrainingRepository from "../../repositories/training.repository";
import Training from "../../entities/training.entity";
import { ValidationException, NotFoundException } from "../../constants/exceptions";
import { TrainingModel, TrainingUpdateModel } from "../../models/training.models";
import Round from "../../entities/round.entity";
import WeaponRepository from "../../repositories/weapon.repository";
import Shot from "../../entities/shot.entity";
import RoundRepository from "../../repositories/round.repository";
import ShotRepository from "../../repositories/shot.repository";
import { checkAuthenticated } from "../../middlewares/auth.handler";
import { ValidationErrorModel } from "../../models/validation.models";
import User from "../../entities/user.entity";

@ApiPath({
	path: "/trainings",
	name: "Trainings"
})
@controller("/api/trainings", checkAuthenticated)
export default class TrainingController extends BaseController {
    constructor(@inject(TrainingRepository) private _trainingRepository: TrainingRepository, @inject(WeaponRepository) private _weaponRepository: WeaponRepository, @inject(RoundRepository) private _roundRepository: RoundRepository, @inject(ShotRepository) private _shotRepository: ShotRepository) {
        super();
    }

	@ApiOperationGet({
		path: "/",
		summary: "Get training list",
		responses: {
			200: { type: "array", model: Training.NAME },
			401: {}
		},
		security: {
			APIKeyHeader: []
		}
	})
	@httpGet("/")
	public async list(req: Request, res: Response) {
		const trainings = await this._trainingRepository.findByUser(req.user as User);

        res.json(await Promise.all(trainings.map(w => w.toJSON())));
	}

	@ApiOperationPost({
		path: "/",
		parameters: {
			body: {
				model: TrainingModel.NAME
			}
		},
		summary: "Create training",
		responses: {
			200: { model: Training.NAME },
			400: { model: ValidationErrorModel.NAME },
			401: {}
		},
		security: {
			APIKeyHeader: []
		}
	})
	@httpPost("/")
	public async create(req: Request, res: Response) {
		const data = new TrainingModel(req.body);

		const errors = await validate(data);

		if(errors.length > 0) {
			throw new ValidationException(errors);
		}

		const training = new Training();
		
		await this.prepareTraining(data, training);

		training.user = req.user as User;
		
		await this._trainingRepository.create(training);

        res.json(await training.toJSON());
	}

	@ApiOperationPut({
		path: "/{id}",
		parameters: {
			path: {
				id: { type: "integer" }
			},
			body: {
				model: TrainingUpdateModel.NAME
			}
		},
		summary: "Update training",
		responses: {
			200: { model: Training.NAME },
			400: { model: ValidationErrorModel.NAME },
			401: {}
		},
		security: {
			APIKeyHeader: []
		}
	})
	@httpPut("/:id")
	public async update(@request() req: Request, @response() res: Response, @queryParam("id") id: number) {
		const data = new TrainingUpdateModel(req.body);

		const errors = await validate(data);
		if(errors.length > 0) {
			throw new ValidationException(errors);
		}

		const training = await this._trainingRepository.findOne(id);
		if (!training) {
			throw new NotFoundException();
		}

		await this.prepareTraining(data, training);
		await this._trainingRepository.update(training);
		
        res.json(await training.toJSON());
	}

	private async prepareTraining(model: TrainingModel | TrainingUpdateModel, training: Training): Promise<Training> {
		const rounds = [];
		
		if (model instanceof TrainingModel) {
			for (const r of model.rounds || []) {
				const shots = [];
	
				for (const s of r.shots) {
					const shot = new Shot({
						points: s.points,
						coordinates_x: s.coordinates_x,
						coordinates_y: s.coordinates_y
					});
	
					await this._shotRepository.create(shot);
					shots.push(shot);
				}
	
				const round = new Round({
					points: r.points,
					accuracy: r.accuracy,
					precision: r.precision,
					overallScore: r.overallScore,
					weapon: Promise.resolve(await this._weaponRepository.findOne(r.weaponId)),
					shots: Promise.resolve(shots)
				});
	
				await this._roundRepository.create(round);
				rounds.push(round);
			}

			training.build({
				name: model.name,
				startDateTime: new Date(model.startDateTime),
				endDateTime: model.endDateTime ? new Date(model.endDateTime) : null,
				earnedXp: model.earnedXp,
				rounds: Promise.resolve(rounds)
			});
		} else if (model instanceof TrainingUpdateModel) {
			training.update({
				name: model.name,
				startDateTime: model.endDateTime !== undefined ? new Date(model.startDateTime) : undefined,
				endDateTime: model.endDateTime !== undefined ? (model.endDateTime ? new Date(model.endDateTime) : null) : undefined,
				earnedXp: model.earnedXp
			});
		}

		return training;
	}
}
