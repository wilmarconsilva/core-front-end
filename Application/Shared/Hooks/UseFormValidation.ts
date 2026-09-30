import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';

export interface IValidationRule {
  key: string;
  isValid: boolean;
  message?: string;
}

export type ValidationErrors = Record<string, string>;

interface UseFormValidationResult {
  errors: ValidationErrors;
  validate: (rules: IValidationRule[]) => boolean;
  clearError: (key: string) => void;
  clearErrors: () => void;
  bindChange: <T>(key: string, setter: (value: T) => void) => (value: T) => void;
}

const DEFAULT_REQUIRED_MESSAGE = 'Campo obrigatório';
const REQUIRED_FIELDS_TOAST_MESSAGE = 'Por favor, preencha os campos obrigatórios com valores válidos.';

function removeKey(record: ValidationErrors, key: string): ValidationErrors {
  if (!(key in record)) return record;
  const next = { ...record };
  delete next[key];
  return next;
}

export function UseFormValidation(): UseFormValidationResult {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((rules: IValidationRule[]): boolean => {
    const next: ValidationErrors = {};
    for (const rule of rules) {
      if (!rule.isValid) {
        next[rule.key] = rule.message ?? DEFAULT_REQUIRED_MESSAGE;
      }
    }
    setErrors(next);

    const hasErrors = Object.keys(next).length > 0;
    if (hasErrors) {
      Toast.show({ type: 'info', text1: REQUIRED_FIELDS_TOAST_MESSAGE });
      return false;
    }
    return true;
  }, []);

  const clearError = useCallback((key: string) => {
    setErrors(prev => removeKey(prev, key));
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  const bindChange = useCallback(
    <T,>(key: string, setter: (value: T) => void) =>
      (value: T) => {
        setter(value);
        setErrors(prev => removeKey(prev, key));
      },
    [],
  );

  return { errors, validate, clearError, clearErrors, bindChange };
}
