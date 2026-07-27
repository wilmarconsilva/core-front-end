import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { IActionButtonProps } from '../Interfaces/Button/IActionButtonProps';
import { buttonStyles, colors } from '../Styles';

type ButtonVariant = 'primary' | 'secondary';

function ActionButtonBase({
  variant,
  title,
  isLoading,
  disabled,
  style,
  ...props
}: IActionButtonProps & { variant: ButtonVariant }) {
  const isDisabled = isLoading || disabled;
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[
        buttonStyles.base,
        isPrimary ? buttonStyles.primary : buttonStyles.secondary,
        isDisabled && buttonStyles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={isPrimary ? 0.8 : 0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? colors.textWhite : colors.textPrimary} />
      ) : (
        <Text
          style={[
            buttonStyles.baseText,
            isPrimary ? buttonStyles.primaryText : buttonStyles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function PrimaryButton(props: IActionButtonProps) {
  return <ActionButtonBase variant="primary" {...props} />;
}

export function SecondaryButton(props: IActionButtonProps) {
  return <ActionButtonBase variant="secondary" {...props} />;
}
