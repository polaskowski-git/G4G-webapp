import { ApiModel } from "swagger-express-ts";
import { ApiModelProperty } from "../constants/decorators";
import { BaseModel } from "./base.model";
import User from "../entities/user.entity";
import { interfaces } from "inversify";

@ApiModel({
    name: RankingElementModel.NAME
})
export class RankingElementModel extends BaseModel<RankingElementModel>
{
    public static readonly NAME = "RankingElement";

    @ApiModelProperty({
        required: true,
        type: 'integer'
    })
    rank: number;

    @ApiModelProperty({
        required: true,
        type: 'string'
    })
    username: string;

    @ApiModelProperty({
        required: true,
        type: "number"
    })
    score: number;

}

@ApiModel({
    name: RankingModel.NAME
})
export class RankingModel extends BaseModel<RankingModel>
{
    public static readonly NAME = "Ranking";

    @ApiModelProperty({
        required: true,
        model: RankingElementModel.NAME
    })
    userElement: RankingElementModel;

    @ApiModelProperty({
        required: true,
        type: "array",
        model: RankingElementModel.NAME
    })
    elements: RankingElementModel[];
}
