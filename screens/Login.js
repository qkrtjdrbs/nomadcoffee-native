import React, { useRef, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { logUserIn } from "../apollo";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import styled from "styled-components/native";
import { color } from "../color";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

const CreateAccountText = styled.Text`
  color: ${color.blue};
  font-weight: 700;
`;

const Error = styled.Text`
  color: tomato;
  font-weight: 700;
`;

export default function Login({ navigation, route: { params } }) {
  //simular to lacation.state.username, password
  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      username: params?.username,
      password: params?.password,
    },
  });
  const passwordRef = useRef();
  const onCompleted = async (data) => {
    const {
      login: { ok, token, error },
    } = data;
    if (ok) {
      await logUserIn(token);
    } else {
      setError("result", {
        message: error,
      });
    }
  };
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });
  const onNext = (nextOne) => {
    //nextOne is Ref name
    nextOne?.current?.focus();
  };
  const onValid = (data) => {
    if (!loading) {
      loginMutation({ variables: { ...data } });
    }
  };
  useEffect(() => {
    register("username", { required: true });
    register("password", { required: true });
  }, [register]);
  return (
    <AuthLayout>
      <Error>{errors?.result?.message}</Error>
      <TextInput
        value={watch("username")}
        placeholder="Username"
        returnKeyType="next"
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue("username", text)}
        style={{
          borderWidth: 1,
          borderColor: "#C4C4C4",
        }}
      ></TextInput>
      <TextInput
        value={watch("password")}
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text) => setValue("password", text)}
        style={{
          borderWidth: 1,
          borderColor: "#C4C4C4",
        }}
      ></TextInput>
      <AuthButton
        text="Log in"
        loading={loading}
        disabled={!watch("username") || !watch("password")}
        onPress={handleSubmit(onValid)}
      />
      <TouchableOpacity
        style={{ marginTop: 50 }}
        onPress={() => navigation.navigate("CreateAccount")}
      >
        <CreateAccountText>No Account?</CreateAccountText>
      </TouchableOpacity>
    </AuthLayout>
  );
}
