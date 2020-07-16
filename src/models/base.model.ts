import { toPairs } from "lodash";

export abstract class BaseModel<T> {
	constructor(options?: Partial<T>) {
		this.build(options);
	}

	public build(options?: Partial<T>) {
		toPairs(options || {}).forEach(arr => (this[arr[0]] = arr[1]));
	}
}
