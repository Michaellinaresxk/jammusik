import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {globalColors, globalFormStyles} from '../../../theme/Theme';
import {PrimaryButton} from '../PrimaryButton';
import {CustomDropdown} from '../CustomDropdown';
import {useCategoryService} from '../../../../context/CategoryServiceContext';
import {auth} from '../../../../infra/api/firebaseConfig';
import {PrimaryIcon} from '../PrimaryIcon';

export const FormCreateSong = ({
  categoryId,
  categoryTitle,
  onSubmit,
  isLoading,
  isEditing = false,
  initialValues = {title: '', artist: ''},
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [artist, setArtist] = useState(initialValues.artist);
  const [errors, setErrors] = useState({
    title: '',
    artist: '',
  });
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const [categories, setCategories] = useState([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const categoryService = useCategoryService();
  const isLibraryOrHome = categoryId === 'Library' || !categoryId;

  const [customCategoryTitle, setCustomCategoryTitle] = useState('');
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      if (!userId) {
        throw new Error('No user logged in');
      }

      const fetchedCategories = await categoryService.getCategories(userId);
      const formattedCategories = fetchedCategories.map(category => ({
        label: category.title,
        value: category.id,
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert(
        'Error',
        'Failed to load categories. Please try again later.',
      );
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      artist: '',
    };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'The title is required';
      isValid = false;
    }

    if (!artist.trim()) {
      newErrors.artist = 'The artist is required';
      isValid = false;
    }

    if (isLibraryOrHome && !selectedCategory && !customCategoryTitle.trim()) {
      Alert.alert('Error', 'Please select or create a category');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const createCategory = async title => {
    setIsCreatingCategory(true);
    try {
      const newCategory = await categoryService.createCategory(userId, title);
      await loadCategories(); // Reload categories to include the new one
      return newCategory.id;
    } catch (error) {
      if (error.message.includes('already exists')) {
        // If category exists, find and return its ID
        const existingCategories = await categoryService.getCategories(userId);
        const existingCategory = existingCategories.find(
          cat => cat.title.toLowerCase() === title.toLowerCase(),
        );
        if (existingCategory) {
          return existingCategory.id;
        }
      }
      throw error;
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let finalCategoryId = selectedCategory;

      // If user entered a custom category
      if (customCategoryTitle.trim() && !selectedCategory) {
        finalCategoryId = await createCategory(customCategoryTitle.trim());
        if (!finalCategoryId) {
          Alert.alert('Error', 'Failed to create category');
          return;
        }
      }

      // Create the song with the category ID
      await onSubmit({
        title: title.trim(),
        artist: artist.trim(),
        categoryId: isLibraryOrHome ? finalCategoryId : categoryId,
      });

      // Clear form after successful submission
      setTitle('');
      setArtist('');
      setCustomCategoryTitle('');
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error with song:', error);
      Alert.alert(
        'Error',
        `Failed to ${isEditing ? 'update' : 'create'} song. Please try again.`,
      );
    }
  };

  return (
    <View style={globalFormStyles.containerForm}>
      <View style={globalFormStyles.form}>
        <TextInput
          style={[
            globalFormStyles.inputLogin,
            errors.title && styles.inputError,
          ]}
          placeholderTextColor="#838282"
          placeholder="Title"
          autoCorrect={false}
          autoCapitalize="words"
          value={title}
          onChangeText={text => {
            setTitle(text);
            setErrors(prev => ({...prev, title: ''}));
          }}
        />
        {errors.title ? (
          <Text style={styles.errorText}>{errors.title}</Text>
        ) : null}

        <TextInput
          style={[
            globalFormStyles.inputLogin,
            errors.artist && styles.inputError,
          ]}
          placeholder="Artist"
          placeholderTextColor="gray"
          autoCapitalize="words"
          autoCorrect={false}
          value={artist}
          onChangeText={text => {
            setArtist(text);
            setErrors(prev => ({...prev, artist: ''}));
          }}
        />
        {errors.artist ? (
          <Text style={styles.errorText}>{errors.artist}</Text>
        ) : null}

        {isLibraryOrHome ? (
          <>
            {categories.length > 0 && (
              <CustomDropdown
                items={categories}
                defaultValue={selectedCategory}
                placeholder="Select a category"
                onChange={value => {
                  setSelectedCategory(value);
                  setCustomCategoryTitle('');
                }}
              />
            )}
            <TextInput
              style={[
                styles.customCategoryInput,
                customCategoryTitle && styles.activeInput,
              ]}
              placeholder="Or type a new category name"
              value={customCategoryTitle}
              onChangeText={text => {
                setCustomCategoryTitle(text);
                setSelectedCategory(null);
              }}
              placeholderTextColor="#838282"
              autoCapitalize="words"
              editable={!isCreatingCategory}
            />
          </>
        ) : (
          <View style={styles.titleContent}>
            <PrimaryIcon
              name="musical-notes-sharp"
              size={22}
              color={globalColors.primary}
            />
            <Text style={styles.categoryText}>
              Category: {categoryTitle || 'Unknown'}
            </Text>
          </View>
        )}

        <PrimaryButton
          label={
            isLoading || isCreatingCategory ? (
              <ActivityIndicator size="large" />
            ) : isEditing ? (
              'Update Song'
            ) : (
              'Create A New Song'
            )
          }
          bgColor={globalColors.primary}
          borderRadius={5}
          colorText={globalColors.light}
          btnFontSize={20}
          onPress={handleSubmit}
          disabled={isLoading || isCreatingCategory}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderColor: 'red',
  },
  titleContent: {
    textAlign: 'center',
    flexDirection: 'row',
    gap: 5,
    backgroundColor: globalColors.primaryAlt,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 14,
    marginBottom: 30,
  },
  categoryText: {
    fontSize: 18,
    color: globalColors.primary,
  },
  customCategoryInput: {
    marginTop: 10,
    backgroundColor: globalColors.light,
    borderWidth: 1,
    borderColor: globalColors.primaryAlt,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  activeInput: {
    borderColor: globalColors.primary,
    borderWidth: 1.5,
  },
});

export default FormCreateSong;
