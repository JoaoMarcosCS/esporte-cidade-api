import { DaysOfWeek } from "../enums/daysOfWeek.enum";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./teacher.entity";
import { Athlete } from "./athlete.entity";

@Entity("modality")
export class Modality {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;

    @Column("text")
    description: string;

    // Trocar para enum antes de subir para produção
    @Column({ type: "text", enum: DaysOfWeek, array: true })
    days_of_week: DaysOfWeek[];

    @Column({ type: "time" })
    start_time: string;

    @Column({ type: "time" })
    end_time: string;

    @Column({ type: "text", array: true })
    class_locations: string[];

    @OneToMany(() => Teacher, (teacher) => teacher.modality, { onDelete: "SET NULL" })
    teachers: Teacher[];

    @ManyToMany(() => Athlete, (athlete) => athlete.modalities)
    registred_athletes: Athlete[];
}
