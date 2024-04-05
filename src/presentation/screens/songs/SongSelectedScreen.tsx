import React from "react";
import { Alert, View } from "react-native";
import { GlobalHeader } from "../../components/shared/GlobalHeader";
import { FloatingActionButton } from "../../components/shared/FloatingActionButton";
import { type RootStackParamsList } from "../../routes/StackNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";

export const SongSelectedScreen = () => {
  const params =
    useRoute<RouteProp<RootStackParamsList, "PlaylistSelected">>().params;

  return (
    <View>
      <GlobalHeader headerTitle={params.title} artist={params.artist} />
      <FloatingActionButton
        onPress={() => Alert.alert("Registrado correctamente")}
      />
    </View>
  );
};
