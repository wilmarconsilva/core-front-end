import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { IEntitySelectFieldProps } from '../Interfaces/EntitySelectField/IEntitySelectFieldProps';
import { entitySelectFieldStyles as styles, filterActionBarStyles, formStyles } from '../Styles';
import { DataGrid } from './DataGrid';
import { FilterActionBar } from './FilterActionBar';

export function EntitySelectField<TListing, TFilter>({
  label,
  value,
  selectedDisplayLabel,
  placeholder = 'Selecione...',
  error,
  disabled,
  listings,
  isLoading,
  onLoadData,
  pageSize,
  buildFilter,
  filterValues = {},
  columns,
  keyExtractor,
  labelExtractor,
  onValueChange,
  renderFilter,
}: IEntitySelectFieldProps<TListing, TFilter>) {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      const filter = buildFilter(1, filterValues);
      onLoadData(filter);
    }
  }, [isOpen]);

  const selectedItem = listings.find(item => keyExtractor(item) === String(value));

  const displayLabel =
    selectedItem != null
      ? labelExtractor(selectedItem)
      : value !== undefined && value !== null && String(value) !== '' && selectedDisplayLabel
        ? selectedDisplayLabel
        : null;

  const handleSearch = async () => {
    setPage(1);
    const filter = buildFilter(1, filterValues);
    await onLoadData(filter);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    const filter = buildFilter(p, filterValues);
    onLoadData(filter);
  };

  const handleSelectItem = (item: TListing) => {
    onValueChange(item);
    setIsOpen(false);
  };

  return (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text
          style={[styles.triggerText, displayLabel == null ? styles.placeholder : null]}
          numberOfLines={1}
        >
          {displayLabel ?? placeholder}
        </Text>
        <Text style={styles.arrow}>🔍︎</Text>
      </TouchableOpacity>
      {error ? <Text style={formStyles.fieldError}>{error}</Text> : null}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>{label}</Text>
                </View>

                {renderFilter ? (
                  <View style={styles.filterSection}>
                    <FilterActionBar onSearch={handleSearch}>
                      <View style={filterActionBarStyles.fieldWide}>{renderFilter(handleSearch)}</View>
                    </FilterActionBar>
                  </View>
                ) : null}

                <ScrollView
                  style={styles.contentContainer}
                  keyboardShouldPersistTaps="handled"
                >
                  <DataGrid<TListing>
                    columns={columns}
                    data={listings}
                    isLoading={isLoading}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onRowPress={handleSelectItem}
                    keyExtractor={keyExtractor}
                  />
                </ScrollView>
                
                <View style={styles.footer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setIsOpen(false)}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
