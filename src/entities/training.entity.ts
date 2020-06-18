import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Generated, OneToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import User from "./user.entity";
import Round from "./round.entity";

@Entity({
	name: "trainings"
})
export default class Training extends BaseEntity<Training> {
	@PrimaryColumn({ type: "int", unsigned: true })
	@Generated()
	id: number;

	@ManyToOne(() => User, u => u.trainings)
	@JoinColumn({ name: "user_id" })
    user: User;

	@OneToMany(
		() => Round,
		c => c.training
	)
	rounds: Promise<Round[]>;
    
	@Column("varchar", { length: 255 })
	name: string;
    
	@Column("datetime")
	startDateTime: Date;
    
	@Column("datetime", { nullable: true })
	endDateTime?: Date;
    
	@Column("int")
	earnedXp: number;

}
