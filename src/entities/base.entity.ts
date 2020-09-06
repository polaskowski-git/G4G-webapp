import { toPairs } from "lodash";

export abstract class BaseEntity<T> {
	id: number;

	constructor(options?: Partial<T>) {
		this.build(options);
	}

	public build(options?: Partial<T>) {
		toPairs(options || {}).forEach(arr => (this[arr[0]] = arr[1]));
	}

	public update(options?: Partial<T>) {
		toPairs(options || {}).forEach(arr => {
			if (arr[1] !== undefined) {
				this[arr[0]] = arr[1];
			}
		});
	}
}
