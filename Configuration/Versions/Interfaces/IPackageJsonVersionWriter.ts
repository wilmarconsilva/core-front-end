export interface IPackageJsonVersionWriter {
  write(projectRoot: string, version: string): Promise<void>;
}
