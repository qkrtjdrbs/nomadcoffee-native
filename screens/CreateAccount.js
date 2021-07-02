import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import styled from "styled-components/native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $username: String!
    $email: String!
    $name: String!
    $location: String!
    $password: String!
    $avatarURL: String
    $githubUsername: String
  ) {
    createAccount(
      username: $username
      email: $email
      name: $name
      location: $location
      password: $password
      avatarURL: $avatarURL
      githubUsername: $githubUsername
    ) {
      ok
      error
    }
  }
`;

const Error = styled.Text`
  color: tomato;
  font-weight: 700;
`;

export default function CreateAccount({ navigation }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm();
  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      navigation.navigate("Tabs");
    } else {
      setError("result", {
        message: error,
      });
    }
  };
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );

  const usernameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const githubRef = useRef();
  const passwordRef = useRef();

  const onNext = (nextOne) => {
    //nextOne is Ref name
    nextOne?.current?.focus();
  };
  const onValid = (data) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };
  useEffect(() => {
    register("name", { required: true });
    register("email", { required: true });
    register("username", { required: true });
    register("password", { required: true });
    register("location", { required: true });
    register("githubUsername");
  }, [register]);
  return (
    <AuthLayout>
      <Error>{errors?.result?.message}</Error>
      <TextInput
        placeholder="Name"
        returnKeyType="next"
        onSubmitEditing={() => onNext(usernameRef)}
        onChangeText={(text) => setValue("name", text)}
      />
      <TextInput
        ref={usernameRef}
        placeholder="Username"
        returnKeyType="next"
        onSubmitEditing={() => onNext(emailRef)}
        onChangeText={(text) => setValue("username", text)}
      />
      <TextInput
        ref={emailRef}
        placeholder="Email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => onNext(locationRef)}
        onChangeText={(text) => setValue("email", text)}
      />
      <TextInput
        ref={locationRef}
        placeholder="Location"
        returnKeyType="next"
        onSubmitEditing={() => onNext(githubRef)}
        onChangeText={(text) => setValue("location", text)}
      />
      <TextInput
        ref={githubRef}
        placeholder="Github Username"
        returnKeyType="next"
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue("githubUsername", text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onValid)}
        lastOne={true}
        onChangeText={(text) => setValue("password", text)}
      />
      <AuthButton
        text="Create Account"
        loading={loading}
        disabled={
          !watch("username") ||
          !watch("password") ||
          !watch("name") ||
          !watch("location") ||
          !watch("email")
        }
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}
