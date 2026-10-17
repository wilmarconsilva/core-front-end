import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Masks } from 'react-native-mask-input';
import { Text, TouchableOpacity, View } from 'react-native';
import { EntitySelectField } from '../../../Shared/Components/EntitySelectField';
import { FormField } from '../../../Shared/Components/FormField';
import { SelectField } from '../../../Shared/Components/SelectField';
import { UseCustomerForm } from '../../../../Application/Persons/Customers/Hooks/UseCustomerForm';
import { ILocalityListing } from '../../../../Application/Territories/Localities/DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../../../../Application/Territories/Localities/DataTransferObjects/ILocalityListingFilter';
import { IEntityFormScreenProps } from '../../../Shared/Interfaces/Screens/IEntityFormScreenProps';
import { colors } from '../../../Shared/Styles';
import { customerFormScreenStyles as styles } from '../Styles/customerFormScreenStyles';
import { CrudFormScreen } from '../../../Shared/Screens/CrudFormScreen';

export function CustomerFormScreen({ id, onGoBack }: IEntityFormScreenProps) {
  const {
    pageSize,
    isEditing,
    isLoadingItem,
    isSaving,
    localities,
    isLoadingLocalities,
    loadLocalities,
    errors,
    name,
    setName,
    personType,
    setPersonType,
    document,
    setDocument,
    documentFieldLabel,
    documentFieldPlaceholder,
    documentMask,
    email,
    setEmail,
    stateRegistration,
    setStateRegistration,
    addresses,
    filterLocalityDescription,
    setFilterLocalityDescription,
    personTypeOptions,
    addressErrorKey,
    updateAddress,
    selectLocality,
    removeAddress,
    handleSave,
  } = UseCustomerForm(id, onGoBack);

  return (
    <CrudFormScreen
      title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      breadcrumbEntityLabel="Clientes"
      breadcrumbCurrentLabel={isEditing ? 'Editar' : 'Novo Cliente'}
      isEditing={isEditing}
      isLoadingItem={isLoadingItem}
      isSaving={isSaving}
      onGoBack={onGoBack}
      onSave={handleSave}
    >
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dados Gerais</Text>
        <FormField label="Nome *" placeholder="Nome completo" value={name} onChangeText={setName} editable={!isSaving} error={errors.name} />
        <SelectField
          label="Tipo de Pessoa *"
          value={personType}
          options={personTypeOptions}
          onValueChange={setPersonType}
          disabled={isSaving}
        />
        <FormField
          label={`${documentFieldLabel} *`}
          placeholder={documentFieldPlaceholder}
          mask={documentMask}
          value={document}
          onChangeText={setDocument}
          editable={!isSaving}
          error={errors.document}
        />
        <FormField
          label="E-mail"
          placeholder="email@exemplo.com"
          value={email}
          onChangeText={setEmail}
          editable={!isSaving}
          keyboardType="email-address"
          error={errors.email}
        />
        <FormField
          label="Inscrição Estadual"
          value={stateRegistration}
          onChangeText={setStateRegistration}
          editable={!isSaving}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Endereço{/* Descomentar quando adaptar orçamentos e pedidos para mais de um endereço: s */}</Text>
        {addresses.map((addr, index) => (
          <View key={index} style={styles.addressCard}>
            <View style={styles.addressHeader}>
              {/* Descomentar quando adaptar orçamentos e pedidos para mais de um endereço: <Text style={styles.addressTitle}>Endereço {index + 1}</Text> */}
              {addresses.length > 1 && (
                <TouchableOpacity onPress={() => removeAddress(index)} activeOpacity={0.7}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
            <EntitySelectField<ILocalityListing, ILocalityListingFilter>
              label="Localidade *"
              value={addr.localityId || undefined}
              selectedDisplayLabel={addr.localityDescription}
              placeholder="Selecione a localidade..."
              disabled={isSaving}
              error={errors[addressErrorKey(index, 'localityId')]}
              listings={localities}
              isLoading={isLoadingLocalities}
              onLoadData={loadLocalities}
              pageSize={pageSize}
              filterValues={{ description: filterLocalityDescription }}
              buildFilter={(page, filters) => ({
                registersStart: (page - 1) * pageSize,
                registersEnd: page * pageSize,
                description: filters.description?.trim() || undefined,
              })}
              columns={[
                { key: 'id', label: 'Código', flex: 1 },
                { key: 'description', label: 'Descrição', flex: 2 },
              ]}
              keyExtractor={(l) => String(l.id)}
              labelExtractor={(l) => l.description}
              onValueChange={(locality) => selectLocality(index, locality)}
              renderFilter={(onSubmitSearch) => (
                <FormField
                  label="Descrição"
                  placeholder="Filtrar..."
                  value={filterLocalityDescription}
                  onChangeText={setFilterLocalityDescription}
                  onSubmitEditing={onSubmitSearch}
                />
              )}
            />
            <View style={styles.row}>
              <View style={styles.rowFieldWide}>
                <FormField label="Logradouro" placeholder="Nome do logradouro" value={addr.street ?? ''} onChangeText={(v) => updateAddress(index, 'street', v)} editable={!isSaving} />
              </View>
              <View style={styles.rowFieldWide}>
                <FormField label="Bairro" placeholder="Nome do bairro" value={addr.neighborhood ?? ''} onChangeText={(v) => updateAddress(index, 'neighborhood', v)} editable={!isSaving} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowFieldCompact}>
                <FormField label="Número" placeholder="Nº" value={addr.number ?? ''} onChangeText={(v) => updateAddress(index, 'number', v)} editable={!isSaving} />
              </View>
              <View style={styles.rowFieldCompact}>
                <FormField
                  label="CEP"
                  placeholder="00000-000"
                  value={addr.postalCode ?? ''}
                  onChangeText={(v) => updateAddress(index, 'postalCode', v)}
                  editable={!isSaving}
                  mask={Masks.ZIP_CODE}
                />
              </View>
            </View>
            <FormField label="Complemento" placeholder="Apt, bloco, etc." value={addr.complement ?? ''} onChangeText={(v) => updateAddress(index, 'complement', v)} editable={!isSaving} />
          </View>
        ))}
        {/*Descomentar quando adaptar orçamentos e pedidos para mais de um endereço: <TouchableOpacity style={styles.addCustomerAddressButton} onPress={addAddress} activeOpacity={0.7}>
          <Ionicons name="add-outline" size={16} color={colors.primary} />
          <Text style={styles.addButtonText}>Adicionar endereço</Text>
        </TouchableOpacity> */}
      </View>
    </CrudFormScreen>
  );
}
