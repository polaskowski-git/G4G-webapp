import { Repository } from "typeorm";
import { injectable, inject } from "inversify";
import DatabaseProvider from "../services/database.provider";

@injectable()
export abstract class BaseRepository<T> {
	protected repository: Repository<T>;

	constructor(@inject(DatabaseProvider) protected readonly _databaseProvider: DatabaseProvider) {
		this._databaseProvider.addRepostitory(this as BaseRepository<T>);
	}

	public init() {
		throw new Error("Not implement init in repository!");
	}

	public async findOne(id: number): Promise<T | null> {
		return (await this.repository.findOne(id)) || null;
	}

	public async findOneBy(data: { [P in keyof T]?: T[P] }): Promise<T | null> {
		return (await this.repository.findOne({ where: data })) || null;
	}

	public async findBy(data: { [P in keyof T]?: T[P] }): Promise<T[]> {
		return this.repository.find({ where: data });
	}

	public async findByIds(ids: number[]): Promise<T[]> {
		return this.repository.findByIds(ids);
	}

	public async create(news: T): Promise<T> {
		return this.repository.save(news);
	}

	public async update(news: T): Promise<T> {
		return this.repository.save(news).catch(err => {
			console.log(err);
			return null;
		});
	}

	public async remove(news: T): Promise<void> {
		await this.repository.remove(news);
	}
}
