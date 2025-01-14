import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {globalColors} from '../../theme/Theme';
import {CustomDropdown} from './CustomDropdown';
import {DEFAULT_CATEGORIES} from '../../../constants/defaultCategories';
import {PrimaryIcon} from './PrimaryIcon';

interface Props {
  categories: Array<{label: string; value: string}>;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  isLibraryOrHome?: boolean;
}

export const EnhancedCategorySelector: React.FC<Props> = ({
  categories = [],
  selectedCategory = '',
  onCategorySelect,
  isLibraryOrHome = false,
}) => {
  const [customCategoryTitle, setCustomCategoryTitle] = useState('');

  useEffect(() => {
    if (selectedCategory) {
      const existingCategory = categories.find(
        cat => cat.value === selectedCategory,
      );
      if (existingCategory) {
        setCustomCategoryTitle('');
      }
    }
  }, [selectedCategory, categories]);

  const handleExistingCategorySelect = (value: string) => {
    console.log('Selected existing category value:', value);
    onCategorySelect(value); // Enviamos el ID de la categoría existente
    setCustomCategoryTitle('');
  };
  const handleDefaultCategorySelect = (category: {label: string}) => {
    console.log('Selected default category:', category.label);
    const title = category.label.trim();
    setCustomCategoryTitle(title);
    onCategorySelect(title); // Enviamos el título para crear nueva categoría
  };

  const handleNewCategoryInput = (text: string) => {
    console.log('New category input:', text);
    setCustomCategoryTitle(text);
    if (text.trim()) {
      onCategorySelect(text.trim()); // Enviamos el título para crear nueva categoría
    }
  };

  return (
    <View style={styles.container}>
      {isLibraryOrHome && categories.length > 0 && (
        <View style={styles.existingCategories}>
          <Text style={styles.sectionTitle}>Your categories:</Text>
          <CustomDropdown
            items={categories}
            defaultValue={selectedCategory}
            placeholder="Select a category"
            onChange={handleExistingCategorySelect}
          />
        </View>
      )}

      {isLibraryOrHome && categories.length <= 3 && (
        <View style={styles.suggestedSection}>
          <Text style={styles.sectionTitle}>
            {categories.length === 0
              ? 'Suggested categories:'
              : 'Or choose from suggested:'}
          </Text>
          <View style={styles.categoriesGrid}>
            {DEFAULT_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  customCategoryTitle === category.label &&
                    styles.selectedCategory,
                ]}
                onPress={() => handleDefaultCategorySelect(category)}>
                <Text
                  style={[
                    styles.categoryText,
                    customCategoryTitle === category.label &&
                      styles.selectedCategoryText,
                  ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {isLibraryOrHome && (
        <View style={styles.newCategorySection}>
          <Text style={styles.sectionTitle}>
            {categories.length === 0
              ? 'Or type a new category:'
              : 'Or create new category:'}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, customCategoryTitle && styles.activeInput]}
              placeholder="Enter category name"
              placeholderTextColor={globalColors.terceary}
              value={customCategoryTitle}
              onChangeText={handleNewCategoryInput}
              autoCapitalize="words"
            />
            {customCategoryTitle && (
              <View style={styles.inputIcon}>
                <PrimaryIcon
                  name="checkmark-circle"
                  size={24}
                  color={globalColors.primary}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    marginVertical: 15,
  },
  existingCategories: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: globalColors.terceary,
    marginBottom: 8,
  },
  suggestedSection: {
    marginVertical: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  categoryButton: {
    backgroundColor: globalColors.primaryAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  selectedCategory: {
    backgroundColor: globalColors.primary,
  },
  categoryText: {
    color: globalColors.primary,
    fontSize: 14,
  },
  selectedCategoryText: {
    color: globalColors.light,
  },
  newCategorySection: {
    marginTop: 15,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: globalColors.light,
    borderWidth: 1,
    borderColor: globalColors.primaryAlt,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    paddingRight: 40,
  },
  activeInput: {
    borderColor: globalColors.primary,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{translateY: -12}],
  },
});
