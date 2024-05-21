/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { UserServiceProvider } from "./context/UserServiceContext";
import { UserInfoServiceProvider } from "./context/UserInfoServiceContext";
import { userInfoService } from "./services/userInfoService";
import { ProviderComposer } from "./context/ProviderComposer";
import { categoryService } from "./services/categoryService";
import { CategoryServiceProvider } from "./context/CategoryServiceContext";
import { playlistService } from "./services/playlistService";
import { PlaylistServiceProvider } from "./context/PlaylistServiceContext";
import { songService } from "./services/songService";
import { SongServiceProvider } from "./context/SongServiceContext";
import { SideMenuNavigator } from "./UI/routes/SideMenuNavigator";
import { userService } from "./services/userService";
function App(): React.JSX.Element {
  return (
    <ProviderComposer
      contexts={[
        <UserServiceProvider userService={userService} />,
        <UserInfoServiceProvider userInfoService={userInfoService} />,
        <CategoryServiceProvider categoryService={categoryService} />,
        <PlaylistServiceProvider playlistService={playlistService} />,
        <SongServiceProvider songService={songService} />,
        // Add other providers here as you create them
      ]}>
      <NavigationContainer>
        <SideMenuNavigator />
      </NavigationContainer>
    </ProviderComposer>
  );
}

export default App;
