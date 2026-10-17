import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { ScreenScrollView } from '../../Shared/Components/ScreenScrollView';
import { ICustomerListing } from '../../../Application/Persons/Customers/DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../../../Application/Persons/Customers/DataTransferObjects/ICustomerListingFilter';
import { IProductListing } from '../../../Application/Products/DataTransferObjects/IProductListing';
import { IProductListingFilter } from '../../../Application/Products/DataTransferObjects/IProductListingFilter';
import { Breadcrumb } from '../../Shared/Components/Breadcrumb';
import { EntitySelectField } from '../../Shared/Components/EntitySelectField';
import { FormField } from '../../Shared/Components/FormField';
import { CheckboxField } from '../../Shared/Components/CheckboxField';
import { IntField } from '../../Shared/Components/IntField';
import { DecimalField } from '../../Shared/Components/DecimalField';
import { PrimaryButton } from '../../Shared/Components/PrimaryButton';
import { SecondaryButton } from '../../Shared/Components/SecondaryButton';
import { SelectField } from '../../Shared/Components/SelectField';
import { SignatureCanvas } from '../../Shared/Components/SignatureCanvas';
import { TextAreaField } from '../../Shared/Components/TextAreaField';
import { colors, layoutStyles, typographyStyles } from '../../Shared/Styles';
import { documentFormScreenStyles as styles } from '../Styles/documentFormScreenStyles';
import { IDocumentFormScreenProps } from '../Interfaces/IDocumentFormScreenProps';
import { PercentageField } from '../../Shared/Components/PercentageField';

export function DocumentFormScreen({
  title,
  breadcrumbEntityLabel,
  breadcrumbCurrentLabel,
  observationsPlaceholder,
  onGoBack,
  renderGeneralExtraFields,
  pageSize,
  isLoadingItem,
  isSaving,
  customers,
  isLoadingCustomers,
  loadCustomers,
  products,
  isLoadingProducts,
  loadProducts,
  errors,
  customerId,
  customerDisplayLabel,
  selectCustomer,
  observations,
  setObservations,
  signature,
  setSignature,
  paymentMethod,
  setPaymentMethod,
  paymentMethodOptions,
  downPaymentMethodOptions,
  discountValue,
  setDiscountValue,
  hasInstallment,
  setHasInstallment,
  installmentQty,
  setInstallmentQty,
  installmentValue,
  hasDownPayment,
  setHasDownPayment,
  downPaymentMethod,
  setDownPaymentMethod,
  downPaymentValue,
  setDownPaymentValue,
  downPaymentPercentage,
  setDownPaymentPercentage,
  productLines,
  updateProductLine,
  selectProductLine,
  addProductLine,
  removeProductLine,
  valueSubtotal,
  valueTotal,
  filterCustomerName,
  setFilterCustomerName,
  filterProductDescription,
  setFilterProductDescription,
  handleSave,
  onGeneratePdf,
}: IDocumentFormScreenProps) {
  return (
    <View style={layoutStyles.screenWrapper}>
      <ScreenScrollView contentContainerStyle={[layoutStyles.scrollContainer, { justifyContent: 'flex-start' }]}>
        <Breadcrumb items={[
          { label: 'Início', onPress: onGoBack },
          { label: breadcrumbEntityLabel, onPress: onGoBack },
          { label: breadcrumbCurrentLabel },
        ]} />
        <Text style={typographyStyles.title}>{title}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados Gerais</Text>
          <EntitySelectField<ICustomerListing, ICustomerListingFilter>
            label="Cliente *"
            value={customerId || undefined}
            selectedDisplayLabel={customerDisplayLabel}
            placeholder="Selecione o cliente..."
            error={errors.customerId}
            disabled={isSaving}
            listings={customers}
            isLoading={isLoadingCustomers}
            onLoadData={loadCustomers}
            pageSize={pageSize}
            filterValues={{ name: filterCustomerName }}
            buildFilter={(page, filters) => ({
              registersStart: (page - 1) * pageSize,
              registersEnd: page * pageSize,
              name: filters.name?.trim() || undefined,
            })}
            columns={[
              { key: 'id', label: 'Código', flex: 1 },
              { key: 'name', label: 'Nome', flex: 2 },
              { key: 'document', label: 'Documento', flex: 1.2 },
            ]}
            keyExtractor={(customer) => String(customer.id)}
            labelExtractor={(customer) => customer.name}
            onValueChange={selectCustomer}
            renderFilter={(onSubmitSearch) => (
              <FormField
                label="Nome"
                placeholder="Filtrar..."
                value={filterCustomerName}
                onChangeText={setFilterCustomerName}
                onSubmitEditing={onSubmitSearch}
              />
            )}
          />
          {renderGeneralExtraFields?.()}
          <TextAreaField
            label="Observações"
            placeholder={observationsPlaceholder}
            value={observations}
            onChangeText={setObservations}
            editable={!isSaving}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Produtos</Text>
          {productLines.map((line, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productField}>
                <EntitySelectField<IProductListing, IProductListingFilter>
                  label="Produto"
                  value={line.productId || undefined}
                  selectedDisplayLabel={line.productDescription}
                  placeholder="Selecione..."
                  disabled={isSaving}
                  listings={products}
                  isLoading={isLoadingProducts}
                  onLoadData={loadProducts}
                  pageSize={pageSize}
                  filterValues={{ description: filterProductDescription }}
                  buildFilter={(page, filters) => ({
                    registersStart: (page - 1) * pageSize,
                    registersEnd: page * pageSize,
                    description: filters.description?.trim() || undefined,
                  })}
                  columns={[
                    { key: 'id', label: 'Código', flex: 1 },
                    { key: 'description', label: 'Descrição', flex: 2 },
                  ]}
                  keyExtractor={(product) => String(product.id)}
                  labelExtractor={(product) => product.description}
                  onValueChange={(product) => selectProductLine(index, product)}
                  renderFilter={(onSubmitSearch) => (
                    <FormField
                      label="Descrição"
                      placeholder="Filtrar..."
                      value={filterProductDescription}
                      onChangeText={setFilterProductDescription}
                      onSubmitEditing={onSubmitSearch}
                    />
                  )}
                />
              </View>
              <View style={styles.productSmallField}>
                <DecimalField
                  label="Qtd."
                  placeholder="0,00"
                  value={line.quantity}
                  onChangeValue={(value) => updateProductLine(index, 'quantity', value)}
                  editable={!isSaving}
                />
              </View>
              <View style={styles.productSmallField}>
                <DecimalField
                  label="Vl. Unit. (R$)"
                  placeholder="0,00"
                  value={line.valueUnit}
                  onChangeValue={(value) => updateProductLine(index, 'valueUnit', value)}
                  editable={!isSaving}
                />
              </View>
              {productLines.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeProductLine(index)}
                  activeOpacity={0.7}
                  style={styles.productRowDelete}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addDocumentProductButton} onPress={addProductLine} activeOpacity={0.7}>
            <Ionicons name="add-outline" size={16} color={colors.primary} />
            <Text style={styles.addButtonText}>Adicionar Produto</Text>
          </TouchableOpacity>
          <View style={styles.summary}>
            <Text style={styles.subtotalText}>
              Subtotal: {valueSubtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
            <Text style={styles.summaryText}>
              Total: {valueTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pagamento</Text>
          <SelectField
            label="Forma de Pagamento"
            value={paymentMethod}
            options={paymentMethodOptions}
            error={errors.paymentMethod}
            onValueChange={setPaymentMethod}
            disabled={isSaving}
          />
          <DecimalField
            label="Desconto (R$)"
            placeholder="0,00"
            value={discountValue}
            onChangeValue={setDiscountValue}
            editable={!isSaving}
          />
          <CheckboxField
            label="Contém parcelamento"
            value={hasInstallment}
            onValueChange={setHasInstallment}
            disabled={isSaving}
          />
          {hasInstallment ? (
            <>
              <IntField
                label="Quantidade de parcelas *"
                placeholder="0"
                value={installmentQty}
                error={errors.installmentQty}
                onChangeText={setInstallmentQty}
                editable={!isSaving}
              />
              <DecimalField
                label="Valor da parcela (R$) *"
                placeholder="Definido automaticamente pela quantidade de parcelas"
                value={installmentValue}
                editable={false}
              />
              <CheckboxField
                label="Contém entrada"
                value={hasDownPayment}
                onValueChange={setHasDownPayment}
                disabled={isSaving}
              />
              {hasDownPayment ? (
                <>
                  <SelectField
                    label="Forma de pagamento da entrada *"
                    value={downPaymentMethod}
                    options={downPaymentMethodOptions}
                    error={errors.downPaymentMethod}
                    onValueChange={setDownPaymentMethod}
                    disabled={isSaving}
                  />
                  <DecimalField
                    label="Valor de entrada (R$) *"
                    placeholder="0,00"
                    value={downPaymentValue}
                    error={errors.downPaymentValue}
                    onChangeValue={setDownPaymentValue}
                    editable={!isSaving}
                  />
                  <PercentageField
                    label="Percentual de entrada (%) *"
                    placeholder="000,00%"
                    value={downPaymentPercentage}
                    error={errors.downPaymentPercentage}
                    onChangeValue={setDownPaymentPercentage}
                    editable={!isSaving}
                  />
                </>
              ) : null}
            </>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Assinatura</Text>
          <SignatureCanvas value={signature} onSignatureChange={setSignature} height={180} />
        </View>

        <View style={styles.documentFooterActions}>
          <SecondaryButton title="Cancelar" onPress={onGoBack} style={{ flex: 1 }} disabled={isSaving} />
          {Platform.OS === 'web' && onGeneratePdf ? (
            <SecondaryButton
              title="Gerar PDF"
              onPress={onGeneratePdf}
              style={{ flex: 1 }}
              disabled={isSaving || isLoadingItem}
            />
          ) : null}
          <PrimaryButton
            title={breadcrumbCurrentLabel === 'Editar' ? 'Salvar' : 'Criar'}
            isLoading={isSaving || isLoadingItem}
            onPress={handleSave}
            style={{ flex: 1 }}
          />
        </View>
      </ScreenScrollView>
    </View>
  );
}
