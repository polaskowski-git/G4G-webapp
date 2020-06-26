// Fix because "Cannot read property 'name' of undefined"
import { SwaggerService } from "swagger-express-ts/swagger.service";

export function ApiModelProperty(args) {
	return function(target, propertyKey) {
		const reflectMetadata = Reflect.getMetadata("design:type", target, propertyKey);
		const propertyType = reflectMetadata ? reflectMetadata.name : "";
		SwaggerService.getInstance().addApiModelProperty(args, target, propertyKey, propertyType);
	};
}