import { useCallback } from 'react';
import { Platform } from 'react-native';

export type DocumentPrintFn = (html: string) => Promise<void>;

export interface UseDocumentPrintResult {
  printHtml: DocumentPrintFn;
}

function printHtmlInIframe(html: string): Promise<void> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute(
      'style',
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;',
    );

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      iframe.removeEventListener('load', onLoad);
      iframe.contentWindow?.removeEventListener('afterprint', finish);
      iframe.remove();
      resolve();
    };

    let printed = false;
    const onLoad = () => {
      if (printed) return;
      printed = true;
      const win = iframe.contentWindow;
      if (!win) {
        finish();
        return;
      }
      win.addEventListener('afterprint', finish);
      win.focus();
      win.print();
      setTimeout(finish, 2000);
    };

    iframe.addEventListener('load', onLoad);
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  });
}

export function UseDocumentPrint(): UseDocumentPrintResult {
  const printHtml = useCallback<DocumentPrintFn>((documentHtml) => {
    if (Platform.OS !== 'web') return Promise.resolve();
    return printHtmlInIframe(documentHtml);
  }, []);

  return { printHtml };
}
