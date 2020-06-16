import * as fs from "fs";
import * as ini from "ini";

import { CONFIG } from "../constants/configs";

export class ConfigUtil {
	public static parse(path: string): void {
		if (!fs.existsSync(path)) throw new Error("config not found");
		const config = ini.parse(fs.readFileSync(path, "utf-8"));
		const configProperty = {};
		Object.entries(config).forEach(arr => {
			const key = arr[0]
				.split(/(?=[A-Z])/)
				.join("_")
				.toUpperCase();
			let value;
			if (arr[1] instanceof Object) {
				value = CONFIG[key] || {};
				Object.entries(arr[1]).forEach(arrProp => {
					const keyProp = arrProp[0]
						.split(/(?=[A-Z])/)
						.join("_")
						.toUpperCase();
					if (CONFIG[key] && CONFIG[key][keyProp] && Array.isArray(CONFIG[key][keyProp])) {
						value[keyProp] = arrProp[1].split(",");
					} else {
						value[keyProp] = arrProp[1];
					}
				});
			} else value = arr[1];

			configProperty[key] = {
				value: value,
				configurable: true
			};
		});

		Object.defineProperties(CONFIG, configProperty);
	}
}
