import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { CategoriesScreen } from "../screens/CategoriesScreen";
import { CategoryScreen } from "../screens/CategoryScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { PathPickScreen } from "../screens/PathPickScreen";
import { globalColors } from "../theme/Theme";
import { BrandLogo } from "../components/shared/BrandLogo";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryIcon } from "../components/shared/PrimaryIcon";
import Icon from "react-native-vector-icons/Ionicons";
import { Separator } from "../components/shared/Separator";
import { BottomTabNavigator } from "./BottomTabNavigator";

const Drawer = createDrawerNavigator();

export const SideMenuNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        drawerActiveBackgroundColor: globalColors.primary,
        drawerActiveTintColor: globalColors.light,
        drawerInactiveTintColor: globalColors.terceary,
        drawerStyle: {
          backgroundColor: globalColors.secondary,
          flex: 1,
          borderEndColor: globalColors.danger,
        },
      }}>
      <Drawer.Screen name="PickPathScreen" component={PathPickScreen} />
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="home-sharp" color={globalColors.light} size={20} />
          ),
        }}
        name="Home"
        component={HomeScreen}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="grid-sharp" color={globalColors.light} size={20} />
          ),
        }}
        name="Categories"
        component={CategoriesScreen}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="grid-sharp" color={globalColors.light} size={20} />
          ),
        }}
        name="Tab"
        component={BottomTabNavigator}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView>
      <View style={styles.userIconContent}>
        <PrimaryIcon
          name="person-circle-outline"
          color={globalColors.primary}
        />
        <Text style={styles.userName}>User Name:</Text>
      </View>
      <Separator color="white" />
      <DrawerItemList {...props} />
      <BrandLogo />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  userIconContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  userName: {
    color: globalColors.terceary,
    fontSize: 20,
  },
});