import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authConfig } from "../config/auth";
import { Log } from "../utils/personalizedLogs.util";
interface User {
  id: number;
  email: string;
  password: string;
  tokens: string;
}

export abstract class BaseAuthService<T> {
  protected abstract findUser(credentials: any): Promise<T | null>;

  protected abstract findUserById(id: number): Promise<T | null>;

  async confirmPassword(password: string, id: number, type: string) {
    try {
      Log.info(
        `Iniciando confirmação de senha para usuário ID ${id} (${type})`
      );

      const user = (await this.findUserById(id)) as User | null;
      if (!user) {
        Log.error(`Usuário ID ${id} não encontrado`);
        return this.failResponse("erro interno");
      }

      Log.debug(`Comparando senha fornecida com hash do usuário...`);
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        Log.error(`Senha incorreta para o usuário ID ${id}`);
        return this.failResponse("senha incorreta digite novamente");
      }

      Log.success(`Senha confirmada com sucesso para o usuário ID ${id}`);
      return this.successResponse(user);
    } catch (error) {
      Log.error(`Erro na autenticação do usuário ID ${id}: ${error}`);
      return this.failResponse("Erro na autenticação");
    }
  }

  protected abstract repository: any;

  async authenticate(credentials: any) {
    try {
      const user = (await this.findUser(credentials)) as User | null;
      if (!user) return this.failResponse("usuário nao existe");

      const passwordMatch = await bcrypt.compare(
        credentials.password,
        user.password
      );
      if (!passwordMatch)
        return this.failResponse("usuário ou senha incorreta");

      const tokens = this.generateTokens(user);
      return this.successResponse(user, tokens);
    } catch (error) {
      console.error("Authentication error:", error);
      return this.failResponse("Erro na autenticação");
    }
  }

  protected generateTokens(user: any) {
    const accessToken = sign(
      this.getAccessTokenPayload(user),
      authConfig.accessToken.secret,
      { expiresIn: authConfig.accessToken.expiresIn }
    );

    const refreshToken = sign({ id: user.id }, authConfig.refreshToken.secret, {
      expiresIn: authConfig.refreshToken.expiresIn,
    });

    return { accessToken, refreshToken };
  }

  protected abstract getAccessTokenPayload(user: T): any;

  protected successResponse(user: any, tokens?: any) {
    return {
      success: true,
      data: {
        ...tokens,
        user: this.getUserResponse(user),
      },
    };
  }

  protected failResponse(message: string) {
    return { success: false, message };
  }

  protected abstract getUserResponse(user: T): any;
}
