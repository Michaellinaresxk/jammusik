import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {PrimaryIcon} from './PrimaryIcon';
import {globalColors} from '../../theme/Theme';

const DEFAULT_CATEGORIES = [
  {label: 'Rock', value: 'rock'},
  {label: 'Pop', value: 'pop'},
  {label: 'Latin Music', value: 'latin-music'},
  {label: 'Reguae', value: 'reguae'},
  {label: 'Funk', value: 'funk'},
];

export const EnhancedCategorySelector = ({
  categories = [],
  onCategorySelect,
  selectedCategory,
}) => {
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  // Para categorías existentes
  const handleCategoryChange = (categoryTitle: string) => {
    setNewCategoryTitle(categoryTitle);
    onCategorySelect(categoryTitle);
  };

  // Para categorías por defecto
  const handleDefaultCategorySelect = (categoryTitle: string) => {
    setNewCategoryTitle(categoryTitle);
    onCategorySelect(categoryTitle);
  };

  // Para nuevas categorías desde el input
  const handleNewCategoryInput = (text: string) => {
    setNewCategoryTitle(text);
    onCategorySelect(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <PrimaryIcon
          name="musical-notes-sharp"
          size={22}
          color={globalColors.primary}
        />
        <Text style={styles.headerText}>
          Please select a suggested category or create your own to organize your
          song..
        </Text>
      </View>

      {categories.length > 0 && (
        <View style={styles.existingCategories}>
          <Text style={styles.sectionTitle}>Your categories:</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.label &&
                    styles.selectedCategory,
                ]}
                onPress={() => handleCategoryChange(category.label)}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.label &&
                      styles.selectedCategoryText,
                  ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.newCategorySection}>
        {categories.length === 0 && (
          <View style={styles.suggestedSection}>
            <Text style={styles.suggestedText}>Suggested:</Text>
            <View style={styles.categoriesGrid}>
              {DEFAULT_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.value}
                  style={styles.suggestionButton}
                  onPress={() => handleDefaultCategorySelect(category.label)}>
                  <Text style={styles.suggestionText}>{category.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        <Text style={styles.sectionTitle}>
          {categories.length === 0
            ? 'Create your custom category:'
            : 'Or create a new one:'}
        </Text>
        <TextInput
          style={[
            styles.input,
            selectedCategory === newCategoryTitle && styles.selectedInput,
          ]}
          placeholder="e.g., Jazz, Rock, Chill, Workout, Party"
          value={newCategoryTitle}
          onChangeText={handleNewCategoryInput}
          autoCapitalize="words"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
    backgroundColor: globalColors.primaryAlt,
    padding: 12,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 16,
    color: globalColors.primary,
    flex: 1,
  },
  existingCategories: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: globalColors.terceary,
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: globalColors.primaryAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
    gap: 8,
  },
  input: {
    backgroundColor: globalColors.light,
    borderWidth: 1,
    borderColor: globalColors.primaryAlt,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  selectedInput: {
    borderColor: globalColors.primary,
    borderWidth: 2,
  },
  suggestedSection: {
    marginTop: 12,
  },
  suggestedText: {
    fontSize: 14,
    color: globalColors.terceary,
    marginBottom: 8,
  },
  suggestionButton: {
    backgroundColor: globalColors.primaryAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  suggestionText: {
    color: globalColors.primary,
    fontSize: 14,
  },
});
