import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import SignaturePad from 'signature_pad';
import { ISignatureCanvasProps } from '../Interfaces/SignatureCanvas/ISignatureCanvasProps';
import { signatureCanvasStyles as styles } from '../Styles';

function toPngBase64(dataUrl: string): string {
  return dataUrl.replace(/^data:image\/png;base64,/, '');
}

function toDataUrl(base64: string): string {
  return base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
}

function resizeCanvas(canvas: HTMLCanvasElement): void {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const displayWidth = canvas.offsetWidth;
  const displayHeight = canvas.offsetHeight;
  if (displayWidth === 0 || displayHeight === 0) return;

  canvas.width = Math.floor(displayWidth * ratio);
  canvas.height = Math.floor(displayHeight * ratio);
  canvas.getContext('2d')?.scale(ratio, ratio);
}

export function SignatureCanvas({ value = null, onSignatureChange, width, height = 200 }: ISignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const loadedValueRef = useRef<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  const applyValue = useCallback(async (base64: string | null) => {
    const pad = padRef.current;
    if (!pad) return;

    if (!base64) {
      pad.clear();
      setHasSignature(false);
      return;
    }

    await pad.fromDataURL(toDataUrl(base64));
    setHasSignature(!pad.isEmpty());
  }, []);

  const syncSignature = useCallback(() => {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) return;
    const base64 = toPngBase64(pad.toDataURL('image/png'));
    loadedValueRef.current = base64;
    onSignatureChange(base64);
    setHasSignature(true);
  }, [onSignatureChange]);

  const handleClear = useCallback(() => {
    padRef.current?.clear();
    loadedValueRef.current = null;
    onSignatureChange(null);
    setHasSignature(false);
  }, [onSignatureChange]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      penColor: '#000000',
      minWidth: 1,
      maxWidth: 2.5,
    });
    padRef.current = pad;
    pad.addEventListener('endStroke', syncSignature);

    const handleResize = () => {
      const snapshot = !pad.isEmpty() ? pad.toDataURL() : null;
      resizeCanvas(canvas);
      pad.clear();
      if (snapshot) {
        void pad.fromDataURL(snapshot);
      }
    };

    handleResize();
    loadedValueRef.current = value;
    void applyValue(value);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      pad.removeEventListener('endStroke', syncSignature);
      pad.off();
      padRef.current = null;
    };
  }, [syncSignature, applyValue, width, height]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const next = value ?? null;
    if (next === loadedValueRef.current) return;
    loadedValueRef.current = next;
    void applyValue(next);
  }, [value, applyValue]);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Assinatura do Cliente</Text>
        <View style={styles.unsupported}>
          <Text style={styles.unsupportedText}>Assinatura disponível apenas na versão web.</Text>
        </View>
      </View>
    );
  }

  const canvasStyle = {
    width: width ?? '100%',
    height,
    display: 'block' as const,
    cursor: 'crosshair',
    touchAction: 'none' as const,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Assinatura do Cliente</Text>
      <Text style={styles.instructions}>Assine no campo abaixo usando o mouse, toque ou caneta.</Text>
      <View style={[styles.canvasWrapper, { height }]}>
        {/* @ts-ignore — canvas é elemento web */}
        <canvas ref={canvasRef} style={canvasStyle} />
      </View>
      {hasSignature && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear} activeOpacity={0.7}>
          <Text style={styles.clearText}>Limpar Assinatura</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
