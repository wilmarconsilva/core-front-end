import React, { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Breadcrumb } from '../Components/Breadcrumb';
import { PrimaryButton } from '../Components/PrimaryButton';
import { SecondaryButton } from '../Components/SecondaryButton';
import { formScreenCommonStyles as styles, layoutStyles, typographyStyles } from '../Styles';

interface CrudFormScreenProps {
  title: string;
  breadcrumbEntityLabel: string;
  breadcrumbCurrentLabel: string;
  isEditing: boolean;
  isLoadingItem: boolean;
  isSaving: boolean;
  onGoBack: () => void;
  onSave: () => Promise<void>;
  children: ReactNode;
}

export function CrudFormScreen({
  title,
  breadcrumbEntityLabel,
  breadcrumbCurrentLabel,
  isEditing,
  isLoadingItem,
  isSaving,
  onGoBack,
  onSave,
  children,
}: CrudFormScreenProps) {
  return (
    <View style={layoutStyles.screenWrapper}>
      <ScrollView contentContainerStyle={[layoutStyles.scrollContainer, { justifyContent: 'flex-start' }]}>
        <Breadcrumb items={[
          { label: 'Início', onPress: onGoBack },
          { label: breadcrumbEntityLabel, onPress: onGoBack },
          { label: breadcrumbCurrentLabel },
        ]} />
        <Text style={typographyStyles.title}>{title}</Text>

        <View style={styles.entityCard}>
          {children}

          <View style={styles.actionRow}>
            <SecondaryButton title="Cancelar" onPress={onGoBack} style={{ flex: 1 }} disabled={isSaving} />
            <PrimaryButton
              title={isEditing ? 'Salvar' : 'Criar'}
              isLoading={isSaving || isLoadingItem}
              onPress={onSave}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
