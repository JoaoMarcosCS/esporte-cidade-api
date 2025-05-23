import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./teacher.entity";
import { Enrollment } from "./enrollment.entity";
import { Atendiment } from "./atendiment.entity";

@Entity("modality")
export class Modality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  ativo: boolean;

  @Column("text")
  name: string;

  @Column("text")
  description: string;

  @Column({ type: "text" })
  days_of_week: string;

  get daysOfWeekArray() {
    return this.days_of_week.split(",");
  }

  @Column({ type: "time" })
  start_time: string;

  @Column({ type: "time" })
  end_time: string;

  @Column({ type: "text" })
  class_locations: string;

  get classLocationsArray() {
    return this.class_locations.split(",");
  }

  @OneToMany(() => Teacher, (teacher) => teacher.modality, {
    onDelete: "SET NULL",
  })
  teachers: Teacher[];

  @OneToMany(() => Atendiment, (a) => a.modality)
  atendiments: Atendiment[];

  @OneToMany(() => Enrollment, (e) => e.modality)
  enrollments: Enrollment[];
}
