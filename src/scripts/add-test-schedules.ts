import { AppDataSource } from "../database/config";
import { Schedule } from "../entities/schedule.entity";
import { Teacher } from "../entities/teacher.entity";

async function addTestSchedules() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();

        // Find all teachers
        const teachers = await AppDataSource.getRepository(Teacher).find();

        if (teachers.length === 0) {
            console.log("Nenhum professor encontrado no banco de dados.");
            return;
        }

        // Generate test schedules for each teacher
        for (const teacher of teachers) {
            console.log(`\nProfessor: ID=${teacher.id}, Nome=${teacher.name}`);
            
            // Get today's date
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            // Generate schedules for today
            const todaySchedules = [
                { name: "Ginásio", time: "08:00", date: today },
                { name: "Campinho", time: "10:00", date: today },
                { name: "Pista", time: "14:00", date: today },
                { name: "Quadra", time: "16:00", date: today }
            ];

            // Generate schedules for tomorrow
            const tomorrowSchedules = [
                { name: "Raspadão", time: "09:00", date: tomorrow },
                { name: "Piscina", time: "11:00", date: tomorrow },
                { name: "Pista", time: "15:00", date: tomorrow },
                { name: "Ginásio", time: "17:00", date: tomorrow }
            ];

            // Create schedule entities
            const schedules = [...todaySchedules, ...tomorrowSchedules].map(schedule => {
                return AppDataSource.getRepository(Schedule).create({
                    name: schedule.name,
                    time: schedule.time,
                    date: schedule.date,
                    teacher
                });
            });

            // Save schedules to database
            await AppDataSource.getRepository(Schedule).save(schedules);

            console.log(`Horários de teste adicionados para o professor ${teacher.name} (ID: ${teacher.id})`);
            console.log("Horários criados:");
            schedules.forEach((schedule, index) => {
                console.log(`${index + 1}. ${schedule.name} - ${schedule.time} - ${schedule.date.toISOString().split('T')[0]}`);
            });
        }

        console.log("\nTodos os horários de teste foram adicionados com sucesso!");

    } catch (error) {
        console.error("Erro ao adicionar horários de teste:", error);
    } finally {
        // Close the database connection
        await AppDataSource.destroy();
    }
}

// Execute the script
addTestSchedules();
