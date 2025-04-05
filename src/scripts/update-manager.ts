import { AppDataSource } from "../database/config";
import { Manager } from "../entities/manager.entity";
import { Address } from "../entities/address.entity";
import bcrypt from 'bcryptjs';

async function updateManager() {
    try {
        // Inicializar o banco de dados
        await AppDataSource.initialize();

        // Buscar o gestor existente
        const manager = await AppDataSource.getRepository(Manager)
            .createQueryBuilder('manager')
            .leftJoinAndSelect('manager.addresses', 'address')
            .where('manager.email = :email', { email: 'test@gerente.com' })
            .getOne();

        if (!manager) {
            console.error('Gestor não encontrado');
            return;
        }

        // Atualizar informações básicas
        manager.name = 'João Silva'; // Nome completo
        manager.email = 'joao.silva@gestor.com'; // Novo email
        manager.cpf = '12345678901'; // CPF sem formatação
        manager.rg = '123456789'; // RG
        manager.birthday = '1980-01-01'; // Data de nascimento no formato YYYY-MM-DD
        manager.phone = '11999999999'; // Telefone sem formatação
        manager.photo_url = 'https://exemplo.com/foto.jpg'; // URL da foto

        // Atualizar senha (se necessário)
        const newPassword = 'novaSenha123';
        manager.password = await bcrypt.hash(newPassword, 10);

        // Atualizar endereço (se houver)
        if (manager.addresses && manager.addresses.length > 0) {
            const address = manager.addresses[0];
            address.street = 'Rua Exemplo';
            address.number = 123; // Número como número
            address.complement = 'Apto 101';
            address.neighborhood = 'Bairro Exemplo';
            address.city = 'São Paulo';
            address.state = 'SP';
            address.references = 'Perto do parque';
        }

        // Salvar as alterações
        await AppDataSource.getRepository(Manager).save(manager);

        console.log('Informações do gestor atualizadas com sucesso!');

    } catch (error) {
        console.error('Erro ao atualizar informações do gestor:', error);
    } finally {
        // Fechar a conexão com o banco de dados
        await AppDataSource.destroy();
    }
}

// Executar o script
updateManager();
