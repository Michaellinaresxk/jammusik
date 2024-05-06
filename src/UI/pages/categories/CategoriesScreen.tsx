import { View, ImageBackground, FlatList } from "react-native";
import { globalStyles } from "../../theme/Theme";
import { images } from "../../../assets/img/Images";
import { CategoryCard } from "../../components/shared/cards/CategoryCard";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { type RootStackParamsList } from "../../routes/StackNavigator";
import { useCategoryService } from "../../../context/CategoryServiceContext";
import { useEffect, useState } from "react";
import { CategoryView } from "../../../views/CategoryView";

const backgroundImage = { uri: images.image3 };

export const CategoriesScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamsList>>();

  const categoryService = useCategoryService();
  const [categories, setCategories] = useState<CategoryView[]>([]);
  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories);
    };

    loadCategories();
  }, [categoryService]);

  return (
    <ImageBackground source={backgroundImage} resizeMode="cover">
      <View style={globalStyles.overlay}>
        <View style={{ marginTop: 50, justifyContent: "center" }}>
          <CategoryCard
            title="All"
            onPress={() =>
              navigation.navigate("CategorySelectedScreen", {
                id: "All",
                title: "All",
              })
            }
          />
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
        </View>
      </View>
    </ImageBackground>
  );
};