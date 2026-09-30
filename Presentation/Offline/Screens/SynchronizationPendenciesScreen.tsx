import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ScreenScrollView } from '../../Shared/Components/ScreenScrollView';
import { Breadcrumb } from '../../Shared/Components/Breadcrumb';
import { DataGrid } from '../../Shared/Components/DataGrid';
import { layoutStyles, tableStyles, typographyStyles } from '../../Shared/Styles';
import { UseSynchronizationPendencies } from '../../../Application/Offline/Hooks/UseSynchronizationPendencies';
import { ISynchronizationPendency } from '../../../Application/Offline/DataTransferObjects/ISynchronizationPendency';
import { SynchronizationEntityTypeUtility } from '../../../Application/Offline/DataTransferObjects/SynchronizationEntityType';
import { ISynchronizationPendenciesScreenProps } from '../Interfaces/ISynchronizationPendenciesScreenProps';

const PAGE_SIZE = 10;

export function SynchronizationPendenciesScreen({ onGoBack, onEditPendency }: ISynchronizationPendenciesScreenProps) {
  const { pendencies, isLoading } = UseSynchronizationPendencies();
  const [page, setPage] = useState(1);

  const pagedPendencies = pendencies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <View style={layoutStyles.screenWrapper}>
      <ScreenScrollView contentContainerStyle={layoutStyles.scrollContainer}>
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
                flex: 2,
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
      </ScreenScrollView>
    </View>
  );
}
