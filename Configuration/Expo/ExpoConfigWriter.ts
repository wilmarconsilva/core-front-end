import { promises as fs } from 'fs';
import path from 'path';
import { ExpoConfigurationFactory } from './ExpoConfigurationFactory';
import { IExpoConfigWriter } from './IExpoConfigWriter';

export class ExpoConfigWriter implements IExpoConfigWriter {
  async write(projectRoot: string): Promise<void> {
    const configuration = ExpoConfigurationFactory.create();
    const appJsonPath = path.join(projectRoot, 'app.json');

    await fs.writeFile(appJsonPath, `${JSON.stringify(configuration, null, 2)}\n`, 'utf8');
  }
}
