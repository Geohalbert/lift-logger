import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

const { width, height } = Dimensions.get("window");

import colors from "../assets/colors";

export default function InputField(props) {
  const {
    autoCompleteType,
    error,
    errorMessage,
    helperText,
    isLogin,
    isRequired,
    isShortened,
    keyboardType,
    label,
    onChangeText,
    placeholder,
    placeholderTextColor,
    secureTextEntry,
    style,
    value,
    ...rest
  } = props;

  const [isFocused, onChangeFocus] = useState(false);

  let labelText = isRequired ? label + "*" : label;

  let stylesArr = [styles.input, style];

  if (isFocused) {
    stylesArr.push(styles.focused);
  }

  if (error) {
    stylesArr.push(styles.error);
  }

  if (isShortened) {
    stylesArr.push(styles.shortened);
  }
  if (isLogin) {
    stylesArr.push(styles.isLogin);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelText}</Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={stylesArr}
        onChangeText={text => onChangeText(text)}
        onFocus={() => onChangeFocus(true)}
        onBlur={() => onChangeFocus(false)}
        autoCompleteType={autoCompleteType}
        value={value}
        {...rest}
      />
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      <Text style={styles.errorMessage}>{(error && errorMessage) || " "}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    width: width * 0.9,
    justifyContent: "center"
  },
  error: {
    borderColor: colors.bgError
  },
  errorMessage: {
    color: colors.bgError
  },

  focused: {
    borderColor: colors.bgSuccess
  },
  helperText: {
    fontSize: 12
  },
  input: {
    height: 50,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    marginHorizontal: 40,
    marginBottom: 10,
    color: colors.txtWhite,
    paddingHorizontal: 10
  },
  isLogin: {
    marginHorizontal: 5
  },
  label: {
    fontWeight: "400",
    paddingLeft: 5,
    marginBottom: 5
  },
  shortened: {
    marginRight: 40,
    width: 220
  }
});
