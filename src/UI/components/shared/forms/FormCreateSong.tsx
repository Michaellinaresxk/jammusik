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
import {useCategoryService} from '../../../../context/CategoryServiceContext';
import {auth} from '../../../../infra/api/firebaseConfig';
import {PrimaryIcon} from '../PrimaryIcon';
import {EnhancedCategorySelector} from '../EnhancedCategorySelector';

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

  const categoryService = useCategoryService();
  const isLibraryOrHome = categoryId === 'Library' || !categoryId;

  const loadCategories = async () => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const fetchedCategories = await categoryService.getCategories(userId);
        const formattedCategories = (fetchedCategories || []).map(category => ({
          label: category.title,
          value: category.id,
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert(
        'Error',
        'Failed to load categories. Please try again later.',
      );
    }
  };
  useEffect(() => {
    loadCategories();
    if (isLibraryOrHome) {
      loadCategories();
    }
  }, [categoryService, isLibraryOrHome]);

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

    if (isLibraryOrHome && !selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Agrega este nuevo método junto a los otros
  const handleCreateCategory = async (title: string) => {
    try {
      setIsCreatingCategory(true);
      // Verifica que el usuario esté autenticado
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const newCategory = await categoryService.createCategory(title);

      // Solo recarga las categorías si la creación fue exitosa
      if (newCategory) {
        await loadCategories();
        setSelectedCategory(newCategory.id);
      }

      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'Failed to create category. Please try again.');
      throw error;
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        let finalCategoryId;

        // Solo creamos categoría si estamos en Library o Home
        if (isLibraryOrHome) {
          try {
            // Asegurarnos de que selectedCategory es un título válido
            const categoryTitle = selectedCategory?.trim();
            if (!categoryTitle) {
              Alert.alert('Error', 'Please select or enter a category name');
              return;
            }

            // Intentar crear la categoría
            const newCategory = await categoryService.createCategory(
              categoryTitle,
            );
            finalCategoryId = newCategory.id;
          } catch (error) {
            if (
              error.message === 'A category with this title already exists!'
            ) {
              // Si la categoría ya existe, buscar su ID
              const userId = auth.currentUser?.uid;
              if (!userId) throw new Error('User not authenticated');

              const existingCategories = await categoryService.getCategories(
                userId,
              );
              const existingCategory = existingCategories.find(
                cat =>
                  cat.title.toLowerCase() === selectedCategory.toLowerCase(),
              );

              if (existingCategory) {
                finalCategoryId = existingCategory.id;
              } else {
                Alert.alert('Error', 'Could not find or create category');
                return;
              }
            } else {
              console.error('Error creating category:', error);
              Alert.alert('Error', 'Failed to create category');
              return;
            }
          }
        } else {
          // Si no estamos en Library/Home, usar el categoryId proporcionado
          finalCategoryId = categoryId;
        }

        // Verificar que tenemos un ID válido
        if (!finalCategoryId) {
          Alert.alert('Error', 'No valid category selected');
          return;
        }

        // Crear la canción
        await onSubmit({
          title,
          artist,
          categoryId: finalCategoryId,
        });
      } catch (error) {
        console.error('Error with song:', error);
        Alert.alert('Error', 'Failed to create song. Please try again.');
      }
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
          placeholderTextColor={'gray'}
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

        {/* {isLibraryOrHome ? (
          categories.length > 0 && (
            <CustomDropdown
              items={categories}
              defaultValue={selectedCategory}
              placeholder="Select a category"
              onChange={value => setSelectedCategory(value)}
            />
          )
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
        )} */}
        {isLibraryOrHome ? (
          <EnhancedCategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onCategoryCreate={handleCreateCategory}
          />
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
          disabled={
            isLoading ||
            isCreatingCategory ||
            (isLibraryOrHome && !selectedCategory)
          }
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
});

export default FormCreateSong;
