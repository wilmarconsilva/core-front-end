import path from 'path';
import { PwaCompositionRoot } from '../Configuration/Pwa/PwaCompositionRoot';

const projectRoot = path.resolve(__dirname, '..');

async function main(): Promise<void> {
  const syncService = PwaCompositionRoot.createArtifactSyncService();
  await syncService.sync(projectRoot);
  console.log('Artefatos web sincronizados com sucesso.');
}

main().catch((error: unknown) => {
  console.error('Failed to synchronize PWA artifacts.', error);
  process.exit(1);
});
