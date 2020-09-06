import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { ApiPath, ApiOperationGet } from "swagger-express-ts";
import { inject } from "inversify";

import BaseController from "../base.controller";
import {checkAuthenticated} from "../../middlewares/auth.handler";
import TrainingRepository from "../../repositories/training.repository";
import ShotRepository from "../../repositories/shot.repository";
import RoundRepository from "../../repositories/round.repository";
import {StatsModel} from "../../models/stats.models";
import User from "../../entities/user.entity";
import UserRepository from "../../repositories/user.repository";
import {RankingModel} from "../../models/rankings.models";

@ApiPath({
    path: "/ranking",
    name: "Ranking"
})
@controller("/api/ranking", checkAuthenticated)
export default class RankingController extends BaseController
{
    constructor(
        @inject(UserRepository) private _userRepository: UserRepository
    ) {
        super();
    }

    @ApiOperationGet({
        path: "/experience",
        summary: "Get experience ranking",
        responses: {
            200: { type: "array", model: RankingModel.NAME }
        }
    })
    @httpGet("/experience")
    public async getExperienceRankingList(req: Request, res: Response)
    {
        const user = req.user as User;
        const elements = await this._userRepository.getRankingByXpPoints(Number(req.query.limit));
        const userElement = user ? await this._userRepository.getRankByXpPointsOfUser(user) : null;
        
        return res.json(new RankingModel({
            elements,
            userElement
        }));
    }

    @ApiOperationGet({
        path: "/accuracy",
        summary: "Get accuracy ranking",
        responses: {
            200: { type: "array", model: RankingModel.NAME }
        }
    })
    @httpGet("/accuracy")
    public async getAccuracyRankingList(req: Request, res: Response)
    {
        const user = req.user as User;
        const elements = await this._userRepository.getRankingByAccuracy(Number(req.query.limit));
        const userElement = user ? await this._userRepository.getRankByAccuracyOfUser(user) : null;
        
        return res.json(new RankingModel({
            elements,
            userElement
        }));
    }
}


