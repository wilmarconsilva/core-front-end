import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Breadcrumb } from '../../Components/Breadcrumb';
import { DataGrid } from '../../Components/DataGrid';
import { layoutStyles, tableStyles, typographyStyles } from '../../Styles';
import { UseSynchronizationPendencies } from '../../../Application/Hooks/UseSynchronizationPendencies';
import { ISynchronizationPendency } from '../../../Application/Interfaces/DataTransferObjects/Offline/ISynchronizationPendency';
import { SynchronizationEntityTypeUtility } from '../../../Application/Interfaces/DataTransferObjects/Offline/SynchronizationEntityType';
import { ISynchronizationPendenciesScreenProps } from '../../Interfaces/Screens/ISynchronizationPendenciesScreenProps';

const PAGE_SIZE = 10;

export function SynchronizationPendenciesScreen({ onGoBack, onEditPendency }: ISynchronizationPendenciesScreenProps) {
  const { pendencies, isLoading } = UseSynchronizationPendencies();
  const [page, setPage] = useState(1);

  const pagedPendencies = pendencies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <View style={layoutStyles.screenWrapper}>
      <ScrollView contentContainerStyle={layoutStyles.scrollContainer}>
        <Breadcrumb items={[{ label: 'Início', onPress: onGoBack }, { label: 'Pendências de Sincronização' }]} />
        <Text style={typographyStyles.title}>Pendências de Sincronização</Text>
        <Text style={typographyStyles.subtitle}>
          Registros criados no modo offline que foram rejeitados pelo servidor. Edite cada registro para corrigir a falha e reenviá-lo.
        </Text>

        <View style={layoutStyles.sectionCard}>
          <DataGrid<ISynchronizationPendency>
            columns={[
              {
                key: 'entityType',
                label: 'Cadastro',
                flex: 0.8,
                render: (item) => (
                  <Text style={tableStyles.cell} numberOfLines={1}>
                    {SynchronizationEntityTypeUtility.getLabel(item.entityType)}
                  </Text>
                ),
              },
              { key: 'description', label: 'Descrição', flex: 1.4 },
              { key: 'failureMessage', label: 'Falha', flex: 2.2 },
            ]}
            data={pagedPendencies}
            isLoading={isLoading}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onEdit={onEditPendency}
            keyExtractor={(item) => item.key}
            emptyGridMessage="Nenhuma pendência de sincronização."
          />
        </View>
      </ScrollView>
    </View>
  );
}
