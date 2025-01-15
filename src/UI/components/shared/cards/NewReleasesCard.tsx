// src/components/releases/cards/NewReleaseCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type {NewRelease} from '../../../../types/tracksTypes';
import {globalColors} from '../../../theme/Theme';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

interface Props {
  release: NewRelease;
  onPress: () => void;
}

export const NewReleaseCard: React.FC<Props> = ({release, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        {release.image && (
          <Image source={{uri: release.image}} style={styles.image} />
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NEW</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {release.name}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {release.artist}
        </Text>
        <Text style={styles.releaseDate}>
          {new Date(release.release_date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginHorizontal: (width - CARD_WIDTH) / 2,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: globalColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: globalColors.light,
    fontSize: 10,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: globalColors.terceary,
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: globalColors.secondary,
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 12,
    color: globalColors.terceary,
  },
});
