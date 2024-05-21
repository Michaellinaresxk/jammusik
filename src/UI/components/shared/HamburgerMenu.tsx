import {
  DrawerActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import { RootStackParamsList } from "../../routes/StackNavigator";
import { PrimaryIcon } from "./PrimaryIcon";
import { globalColors } from "../../theme/Theme";

export const HamburgerMenu = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamsList>>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={{ marginRight: 10 }}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}>
          <PrimaryIcon
            name="menu-sharp"
            color={globalColors.primary}></PrimaryIcon>
        </Pressable>
      ),
    });
  }, []);

  return <></>;
};
