export const ModeOfSignUp = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  APPLE: 'APPLE',
};

export class UserM {
  id: string;
  email: string;
  name: string;
  image: string | null;
  lastLogin: Date | null;
  isEmailVerified: boolean;
  modeOfSignUp: (typeof ModeOfSignUp)[keyof typeof ModeOfSignUp];
  password: string;

  constructor(data: Partial<UserM>) {
    Object.assign(this, data);
  }
}
