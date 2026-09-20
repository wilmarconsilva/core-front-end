import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { IActionButtonProps } from '../Interfaces/Button/IActionButtonProps';
import { IPressableInteractionState } from '../Interfaces/Pressable/IPressableInteractionState';
import { buttonStyles, colors, interactionStyles } from '../Styles';

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
    <Pressable
      // Pressable (e não TouchableOpacity) porque no react-native-web ele entrega
      // `hovered` e `focused`, que é o que dá resposta ao mouse e ao teclado no
      // desktop. No iOS/Android esses estados chegam undefined e nada muda.
      style={({ pressed, hovered }: IPressableInteractionState) => [
        buttonStyles.base,
        isPrimary ? buttonStyles.primary : buttonStyles.secondary,
        isDisabled && buttonStyles.disabled,
        !isDisabled && (pressed || hovered) && interactionStyles.hovered,
        style,
      ]}
      disabled={isDisabled}
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
    </Pressable>
  );
}

export function PrimaryButton(props: IActionButtonProps) {
  return <ActionButtonBase variant="primary" {...props} />;
}

export function SecondaryButton(props: IActionButtonProps) {
  return <ActionButtonBase variant="secondary" {...props} />;
}
