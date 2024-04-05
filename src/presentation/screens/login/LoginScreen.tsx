import { ImageBackground, StyleSheet, View } from "react-native";
import { globalStyles } from "../../theme/Theme";
import { Formlogin } from "../../components/shared/FormLogin";
import { images } from "../../../assets/img/Images";
import { BrandLogo } from "../../components/shared/BrandLogo";
import React from "react";
import { LinkLoginRegister } from "../../components/shared/LinkLoginRegister";
export const LoginScreen = () => {
  const image = {
    uri: images.loginBackground,
  };

  return (
    <ImageBackground
      source={image}
      style={styles.containerImage}
      resizeMode="cover"
      alt="Imagen de fondo">
      <View style={globalStyles.overlay}>
        <View style={styles.containerLoginScreen}>
          <View style={styles.containerLogo}>
            <BrandLogo />
          </View>
          <View style={styles.containerForm}>
            <Formlogin />
            <LinkLoginRegister
              text="Not a member yet?"
              link="Register"
              goTo={"RegisterScreen"}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    flex: 1,
    justifyContent: "center",
  },
  containerLoginScreen: {
    flex: 1,
  },
  containerLogo: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  containerForm: {
    flex: 3,
  },
});
