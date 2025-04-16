import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { UserBase } from "./user-base.entity";
import { Modality } from "./modality.entity";
import { Schedule } from "./schedule.entity";

@Entity("teacher")
export class Teacher extends UserBase {
    @Column("text")
    about: string;

    @ManyToOne(() => Modality, (modality) => modality.teachers, { onDelete: "SET NULL" })
    modality: Modality;

    @OneToMany(() => Schedule, schedule => schedule.teacher)
    schedules: Schedule[];
}
