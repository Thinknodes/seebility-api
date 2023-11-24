export interface ITemplateService {
  createMessage(
    template: string,
    context: Record<string, unknown>,
  ): Promise<string>;
}
