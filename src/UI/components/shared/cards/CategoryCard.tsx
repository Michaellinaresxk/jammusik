import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {globalColors} from '../../../theme/Theme';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  categoryId: string;
  title: string;
  onPress: () => void;
  onEdit?: (categoryId: string, title: string) => void;
  onDelete: (categoryId: string) => void;
};

export const CategoryCard = ({title, onPress, onDelete, onEdit}: Props) => {
  const deleteConfirmation = (categoryId: string) =>
    Alert.alert('Are you sure?', 'Do you want to remove this category?', [
      {
        text: 'UPS! BY MISTAKE',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'YES, DELETE!',
        onPress: () => onDelete(categoryId),
        style: 'destructive',
      },
    ]);

  const editConfirmation = (categoryId: string, title: string) =>
    Alert.alert('Are you sure?', 'Do you want to edit this category?', [
      {
        text: 'UPS! BY MISTAKE',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'YES, EDIT!',
        onPress: () => onEdit && onEdit(categoryId, title), // Pasar ambos parámetros
        style: 'destructive',
      },
    ]);

  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <Text style={styles.categoryCardText}>{title}</Text>
      <View style={styles.containerIcons}>
        <Icon
          name="pencil-sharp"
          color={globalColors.light}
          onPress={event => {
            event.stopPropagation();
            editConfirmation(categoryId, title); // Necesitamos estas props
          }}
          size={20}
        />
        <Icon
          name="trash-sharp"
          color={globalColors.light}
          onPress={event => {
            event.stopPropagation();
            deleteConfirmation(categoryId);
          }}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    backgroundColor: globalColors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 135,
    width: 150,
    margin: 10,
  },
  categoryCardText: {
    color: globalColors.light,
    paddingHorizontal: 5,
    fontSize: 18,
    fontWeight: '300',
  },
  containerIcons: {
    padding: 10,
    gap: 15,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
