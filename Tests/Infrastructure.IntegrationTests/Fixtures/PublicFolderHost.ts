import fs from 'fs';
import path from 'path';

export const PUBLIC_FOLDER_HOST_URL = 'http://core-web.test';

const PUBLIC_FOLDER = path.resolve(__dirname, '../../../public');

/**
 * Faz o papel do servidor web da PWA: expõe `window.location` e responde ao `fetch` com os arquivos
 * de `public/`, exatamente como o navegador os receberia (inclusive 404 para arquivos ausentes).
 */
export class PublicFolderHost {
  readonly requestedPaths: string[] = [];

  install(): this {
    (globalThis as { window?: unknown }).window = { location: { origin: PUBLIC_FOLDER_HOST_URL } };
    jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => this.handle(String(input)));
    return this;
  }

  static readPublicFile(relativePath: string): string {
    return fs.readFileSync(path.join(PUBLIC_FOLDER, relativePath), 'utf8');
  }

  private handle(url: string): Response {
    const { origin, pathname } = new URL(url);
    if (origin !== PUBLIC_FOLDER_HOST_URL) return new Response(null, { status: 502 });

    this.requestedPaths.push(pathname);

    const filePath = path.join(PUBLIC_FOLDER, decodeURIComponent(pathname));
    if (!filePath.startsWith(PUBLIC_FOLDER) || !fs.existsSync(filePath)) return new Response(null, { status: 404 });

    return new Response(fs.readFileSync(filePath), { status: 200 });
  }
}
