import { promises as fs } from 'fs';
import path from 'path';
import { IPackageJsonVersionWriter } from './Interfaces/IPackageJsonVersionWriter';

export class PackageJsonVersionWriter implements IPackageJsonVersionWriter {
  async write(projectRoot: string, version: string): Promise<void> {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

    packageJson.version = version;

    await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
  }
}
