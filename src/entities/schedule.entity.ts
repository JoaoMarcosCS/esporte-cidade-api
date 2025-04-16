import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Teacher } from "./teacher.entity";

@Entity("schedules")
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    time: string;

    @Column({ type: "date" })
    date: Date;

    @ManyToOne(() => Teacher, teacher => teacher.schedules)
    @JoinColumn({ name: "teacher_id" })
    teacher: Teacher;
}
