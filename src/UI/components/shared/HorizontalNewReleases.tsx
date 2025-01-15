// src/components/releases/HorizontalNewReleases.tsx
import React, {useMemo, useState} from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';
import type {NewRelease} from '../../../types/tracksTypes';
import {globalColors} from '../../theme/Theme';
import {NewReleaseCard} from './cards/NewReleasesCard';

const {width} = Dimensions.get('window');
const ITEMS_PER_PAGE = 3;

interface Props {
  releases: NewRelease[];
  onReleasePress: (release: NewRelease) => void;
}

export const HorizontalNewReleases: React.FC<Props> = ({
  releases,
  onReleasePress,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const groupedReleases = useMemo(() => {
    const groups = [];
    for (let i = 0; i < releases.length; i += ITEMS_PER_PAGE) {
      groups.push(releases.slice(i, i + ITEMS_PER_PAGE));
    }
    return groups;
  }, [releases]);

  const renderGroup = ({item: group}: {item: NewRelease[]}) => (
    <View style={styles.pageContainer}>
      {group.map(release => (
        <NewReleaseCard
          key={release.id}
          release={release}
          onPress={() => onReleasePress(release)}
        />
      ))}
    </View>
  );

  return (
    <View>
      <FlatList
        data={groupedReleases}
        renderItem={renderGroup}
        keyExtractor={(_, index) => `group-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={width}
        onScroll={event => {
          const newPage = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentPage(newPage);
        }}
        scrollEventThrottle={16}
      />
      <View style={styles.indicatorContainer}>
        {groupedReleases.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentPage && styles.indicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    width: width,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: globalColors.terceary,
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: globalColors.primaryaryAlt2,
    width: 10,
    height: 10,
  },
});
