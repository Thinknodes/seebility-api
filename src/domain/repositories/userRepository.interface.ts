import { RegisterDto } from '@infrastructure/controllers/auth/auth-dto.class';
import { UserM } from '../model/user';

export interface RegisterDTO {
  email: string;
  name: string;
  isEmailVerified: boolean;
  image?: string;
}

export interface UserRepository {
  getUserByEmail(email: string): Promise<UserM | null>;
  updateLastLogin(id: string): Promise<void>;
  createUser(data: RegisterDto): Promise<UserM>;
  createOauthUser(data: RegisterDTO): Promise<UserM>;
  updateProfile(
    data: Partial<Omit<UserM, 'modeOfSignup'>>,
    id: string,
  ): Promise<UserM>;
  updatePassword(id: string, password: string): Promise<void>;
  delete(id: string): Promise<void>;
  toModel(data: any): UserM;
}
