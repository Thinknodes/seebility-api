export interface MailConfig {
  getMailHost(): string;
  getMailUseSSL(): boolean;
  getMailPort(): number;
  getMailUser(): string;
  getMailPassword(): string;
  getMailFrom(): string;
}
