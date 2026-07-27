import React from 'react';
import {
  Modal,
  Text,
  View,
} from 'react-native';
import { IConfirmDialogProps } from '../Interfaces/ConfirmDialog/IConfirmDialogProps';
import { modalStyles } from '../Styles';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

export function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: IConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.dialog}>
          <Text style={modalStyles.title}>{title}</Text>
          <Text style={modalStyles.message}>{message}</Text>
          <View style={modalStyles.actions}>
            <SecondaryButton
              title={cancelLabel}
              onPress={!isLoading ? onCancel : undefined}
              disabled={isLoading}
              style={{ flex: 1, marginTop: 0 }}
            />
            <PrimaryButton
              title={confirmLabel}
              isLoading={isLoading}
              onPress={onConfirm}
              style={{ flex: 1, marginTop: 0 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
