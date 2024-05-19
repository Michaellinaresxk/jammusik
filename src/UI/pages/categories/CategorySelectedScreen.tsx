import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamsList } from "../../routes/StackNavigator";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GlobalHeader } from "../../components/shared/GlobalHeader";
import { TheGreenBorder } from "../../components/shared/TheGreenBorder";
import { useCategoryService } from "../../../context/CategoryServiceContext";
import { useEffect, useState } from "react";
import { SongView } from "../../../views/SongView";
import { getAuth } from "firebase/auth";
import { globalColors } from "../../theme/Theme";
import { SongCounter } from "../../components/shared/SongCounter";
import { SongCard } from "../../components/shared/cards/SongCard";

export const CategorySelectedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamsList>>();
  const params =
    useRoute<RouteProp<RootStackParamsList, "CategoriesScreen">>().params;
  const auth = getAuth();

  const categoryService = useCategoryService();
  const userId = auth.currentUser?.uid as string;
  const [songList, setSongList] = useState<SongView[]>([]);

  const categoryId = params.id as string;
  const categoryAll = "All";

  const [resetToggle, setResetToggle] = useState(false);

  const handleResetSongs = () => {
    setResetToggle(prev => !prev);
  };

  useEffect(() => {
    if (categoryId === categoryAll) {
      const fetchSongList = async () => {
        const fetchedSongs = await categoryService.getAllSongsByUserId(userId);
        setSongList(fetchedSongs);
      };
      fetchSongList();
    } else {
      const fetchSongsById = async () => {
        const fetchSongListByid = await categoryService.getSongListByCategory(
          categoryId,
          userId,
        );
        setSongList(fetchSongListByid);
      };
      fetchSongsById();
    }
  }, [categoryId, categoryService, userId]);

  if (!categoryId) {
    console.error("Failed to retrieve categoryId");
    return;
  }

  return (
    <>
      <TheGreenBorder />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView>
          <View>
            <GlobalHeader headerTitle={params.title} />
            <View style={styles.songCardContainer}>
              <SongCounter songCounter={songList.length} />
              <FlatList
                data={songList}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                  <View>
                    <SongCard
                      resetToggle={resetToggle}
                      title={item.title}
                      artist={item.artist}
                      color={
                        index % 2 === 0
                          ? globalColors.primary
                          : globalColors.secondary
                      }
                      onPress={() =>
                        navigation.navigate("SongSelectedScreen", {
                          id: item.id,
                          title: item.title,
                          artist: item.artist,
                          categoryId: item.categoryId,
                        })
                      }
                    />
                  </View>
                )}
              />
              <View>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={handleResetSongs}>
                  <Text style={styles.resetBtnText}>RESET SONGS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  songCardContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  resetBtn: {
    backgroundColor: globalColors.primaryAlt,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 300,
    borderRadius: 5,
    width: "50%",
  },
  resetBtnText: {
    color: globalColors.primary,
  },
});
