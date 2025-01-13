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
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({
    title: '',
    artist: '',
  });

  const categoryService = useCategoryService();
  const isLibraryOrHome = categoryId === 'Library' || !categoryId;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const fetchedCategories = await categoryService.getCategories(userId);
          const formattedCategories = (fetchedCategories || []).map(
            category => ({
              label: category.title,
              value: category.id,
            }),
          );
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to load categories');
      }
    };

    if (isLibraryOrHome) {
      loadCategories();
    }
  }, [categoryService, isLibraryOrHome]);

  const handleCategorySelect = (value: string) => {
    const existingCategory = categories.find(cat => cat.value === value);
    if (existingCategory) {
      // Si es un ID de categoría existente
      setSelectedCategoryId(value);
      setNewCategoryTitle('');
    } else {
      // Si es un título nuevo (de input o suggested)
      setSelectedCategoryId(null);
      setNewCategoryTitle(value);
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      artist: '',
    };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!artist.trim()) {
      newErrors.artist = 'Artist is required';
      isValid = false;
    }

    if (isLibraryOrHome && !selectedCategoryId && !newCategoryTitle.trim()) {
      Alert.alert('Error', 'Please select or create a category');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        let finalCategoryId = selectedCategoryId;
        const userId = auth.currentUser?.uid;

        if (!userId) {
          Alert.alert('Error', 'User must be logged in');
          return;
        }

        if (!selectedCategoryId && newCategoryTitle.trim()) {
          try {
            const categoryResponse = await categoryService.createCategory(
              newCategoryTitle.trim(),
              userId,
            );
            finalCategoryId = categoryResponse.id;
          } catch (error: any) {
            if (error.message.includes('already exists')) {
              const existingCategories = await categoryService.getCategories(
                userId,
              );
              const existingCategory = existingCategories.find(
                cat =>
                  cat.title.toLowerCase() ===
                  newCategoryTitle.trim().toLowerCase(),
              );
              if (existingCategory) {
                finalCategoryId = existingCategory.id;
              }
            } else {
              throw error;
            }
          }
        }

        await onSubmit({
          title: title.trim(),
          artist: artist.trim(),
          categoryId: finalCategoryId!,
        });
      } catch (error) {
        console.error('Error in form:', error);
        Alert.alert('Error', 'Failed to create song');
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
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        <TextInput
          style={[
            globalFormStyles.inputLogin,
            errors.artist && styles.inputError,
          ]}
          placeholder="Artist"
          placeholderTextColor="#838282"
          autoCapitalize="words"
          autoCorrect={false}
          value={artist}
          onChangeText={text => {
            setArtist(text);
            setErrors(prev => ({...prev, artist: ''}));
          }}
        />
        {errors.artist && <Text style={styles.errorText}>{errors.artist}</Text>}

        {isLibraryOrHome ? (
          <EnhancedCategorySelector
            categories={categories}
            selectedCategory={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
            isLibraryOrHome={true}
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
            isLoading ? (
              <ActivityIndicator size="large" />
            ) : isEditing ? (
              'Update Song'
            ) : (
              'Create Song'
            )
          }
          bgColor={globalColors.primary}
          borderRadius={5}
          colorText={globalColors.light}
          btnFontSize={20}
          onPress={handleSubmit}
          disabled={
            isLoading ||
            (isLibraryOrHome && !selectedCategoryId && !newCategoryTitle)
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: '#c62828',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderColor: '#c62828',
  },
  titleContent: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: globalColors.primaryAlt,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 14,
    marginBottom: 30,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 18,
    color: globalColors.primary,
  },
});
