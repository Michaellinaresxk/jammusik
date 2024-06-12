/* eslint-disable */

import { Text, View, TextInput, ActivityIndicator, Button } from "react-native";
import { PrimaryButton } from "../PrimaryButton";
import { globalColors, globalFormStyles } from "../../../theme/Theme";
import React from "react";

import { Formik } from "formik";
import { validationLoginForm } from "./yup/validation_login_yup";

interface FormLoginProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onLogin: () => Promise<void>;
  isLoading: boolean;

}



export const Formlogin = ({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  isLoading, error, setError
}: FormLoginProps) => {




  return (
    <View style={globalFormStyles.containerForm}>
      <Text style={globalFormStyles.labelTitle}></Text>

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={values => onLogin(values)}
        validationSchema={validationLoginForm}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={globalFormStyles.form}>
            <View>
              <TextInput
                style={globalFormStyles.inputLogin}
                placeholderTextColor="#838282"
                keyboardType="email-address"
                placeholder="Email"
                value={values.email}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={handleChange("email")}
                onFocus={() => setError('')}
              />
              {errors.email && touched.email ? (
                <Text style={{ color: "red" }}>{errors.email}</Text>
              ) : null}

              <TextInput
                style={globalFormStyles.inputLogin}
                placeholder="Password"
                autoCorrect={false}
                autoCapitalize="none"
                value={values.password}
                secureTextEntry={true}
                placeholderTextColor="#838282"
                onChangeText={handleChange("password")}
                onFocus={() => setError('')}
              />

              {errors.password && touched.password ? (
                <Text style={{ color: "red" }}>{errors.password}</Text>
              ) : null}
            </View>
            {error ? <View style={{ marginTop: 10, padding: 10, backgroundColor: globalColors.danger }}>
              <Text style={{ color: globalColors.light, textAlign: 'center' }}>{error}</Text>
            </View> : null}
            <View style={{ marginTop: 20 }}>
              <PrimaryButton
                label={
                  !isLoading ? "SIGN IN" : <ActivityIndicator size={"large"} />
                }
                bgColor={globalColors.primary}
                borderRadius={5}
                colorText={globalColors.secondary}
                btnFontSize={20}
                onPress={handleSubmit}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};
