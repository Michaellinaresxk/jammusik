import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { globalColors } from "../theme/Theme";
import { images } from "../../assets/img/Images";

const backgroundImage = { uri: images.pathpickBackground };

export const PathPickScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.image}>
        <PrimaryButton label="REGISTER" />
        <PrimaryButton label="Facebook" />
        <PrimaryButton label="Google" />
        <Text style={styles.text}>
          Already have an account? <Text style={styles.link}>LOGIN</Text>
        </Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  text: {
    color: "white",
    fontSize: 15,
    lineHeight: 84,
    textAlign: "center",
  },
  link: {
    fontWeight: "bold",
    color: globalColors.primary,
  },
});
export default PathPickScreen;
