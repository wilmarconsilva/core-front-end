export type FileSaveFn = (content: Blob, fileName: string) => void;

export interface UseFileSaveResult {
  saveFile: FileSaveFn;
}

/**
 * Baixa o arquivo. O link aponta para um Blob de tipo genérico (`application/octet-stream`): com o tipo
 * real (ex.: `application/pdf`) o Safari do iOS abre o arquivo no visualizador, numa URL `blob:`, em vez
 * de baixá-lo. O nome do arquivo mantém a extensão, que é o que define como ele será aberto depois.
 */
function downloadFile(content: Blob, fileName: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/octet-stream' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoked later: some browsers (Safari) read the blob after click() returns.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function UseFileSave(): UseFileSaveResult {
  return { saveFile: downloadFile };
}
