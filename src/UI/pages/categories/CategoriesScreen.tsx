import {
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  Pressable,
  RefreshControl,
} from "react-native";
import { globalColors, globalStyles } from "../../theme/Theme";
import { images } from "../../../assets/img/Images";
import { CategoryCard } from "../../components/shared/cards/CategoryCard";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { type RootStackParamsList } from "../../routes/StackNavigator";
import { useCategoryService } from "../../../context/CategoryServiceContext";
import { useEffect, useState } from "react";
import { CategoryView } from "../../../views/CategoryView";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { FormCreateCategory } from "../../components/shared/forms/FormCreateCategory";
import { getAuth } from "firebase/auth";
import { Separator } from "../../components/shared/Separator";
import Icon from "react-native-vector-icons/Ionicons";
import { usePullRefresh } from "../../../hooks/usePullRefresing";
const backgroundImage = { uri: images.image3 };

export const CategoriesScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamsList>>();
  const auth = getAuth();
  const categoryService = useCategoryService();
  const [categories, setCategories] = useState<CategoryView[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const user = auth.currentUser;
      const userId = user?.uid as string;
      try {
        const fetchedCategories = await categoryService.getCategories(userId);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    };
    loadCategories();
  }, [auth.currentUser, categories, categoryService]);

  const [isVisible, setIsVisible] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  const [title, setTitle] = useState("");
  const closeModal = () => {
    setIsVisible(!isVisible);
  };

  const handleCreateCategory = async () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      console.log("Creating category...");
      await categoryService.createCategory(userId, title);
      setTitle("");
      setTriggerUpdate(prev => !prev); // Trigger the update to reload categories
      closeModal();
    }
  };

  const { isRefreshing, refresh, top } = usePullRefresh();

  return (
    <ImageBackground source={backgroundImage} resizeMode="cover">
      <View style={globalStyles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                progressViewOffset={top}
                colors={[
                  globalColors.primary,
                  globalColors.terceary,
                  globalColors.primary,
                ]}
                onRefresh={refresh}
              />
            }>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 10,
              }}>
              <Pressable
                style={styles.goBackContent}
                onPress={() => navigation.navigate("HomeScreen")}>
                <Icon
                  name="arrow-back-sharp"
                  color={globalColors.light}
                  size={30}
                />
              </Pressable>
              <View style={styles.containerHeader}>
                <View style={styles.titleContent}>
                  <Icon
                    name="musical-notes-sharp"
                    color={globalColors.primary}
                    size={30}
                  />
                  <Text style={styles.title}>Categories</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsVisible(true)}
                  style={styles.openModalBtn}>
                  {/* <Icon name="id-card-sharp" color={globalColors.primary} size={23} /> */}
                  <Text style={styles.openModalBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Separator color={globalColors.terceary} />
            <View style={{ marginTop: 30, justifyContent: "center" }}>
              <FlatList
                data={categories}
                keyExtractor={item => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                  <CategoryCard
                    title={item.title}
                    onPress={() =>
                      navigation.navigate("CategorySelectedScreen", {
                        id: item.id,
                        title: item.title,
                        categoryId: item.categoryId,
                      })
                    }
                  />
                )}
              />
              <Modal
                visible={isVisible}
                animationType="slide"
                presentationStyle="formSheet">
                <View style={styles.modalBtnContainer}>
                  <Text style={styles.modalFormHeaderTitle}>
                    Add Category Info
                  </Text>
                  <PrimaryButton
                    label="Close"
                    btnFontSize={20}
                    colorText={globalColors.light}
                    onPress={() => closeModal()}
                  />
                </View>
                <FormCreateCategory
                  title={title}
                  setTitle={setTitle}
                  onCreateCategory={handleCreateCategory}
                />
              </Modal>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  goBackContent: {
    fontSize: 15,
    fontWeight: "bold",
    margin: "auto",
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  goBackLabel: {
    fontSize: 15,
    color: globalColors.terceary,
  },
  titleContent: {
    flexDirection: "row",
    gap: 5,
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: globalColors.light,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    padding: 30,
  },
  modalBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: globalColors.primary,
    paddingLeft: 10,
  },
  modalFormHeaderTitle: {
    fontSize: 20,
    color: globalColors.light,
  },
  openModalBtn: {
    backgroundColor: globalColors.primaryAlt,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  openModalBtnText: {
    color: globalColors.primary,
    fontSize: 25,
  },
});
