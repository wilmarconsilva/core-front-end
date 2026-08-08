export interface IExpoConfigWriter {
  write(projectRoot: string): Promise<void>;
}
