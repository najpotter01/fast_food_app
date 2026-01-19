import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import Custominput from "@/components/Custominput";

const Signup = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '',email: '', password: '' });

    const submit = async () => {
        const {name, email, password } = form;

        if(!name || !email || !password) return Alert.alert('Error', 'Please enter valid email address & password.');

        setIsSubmitting(true)

        try {
            await createUser({email, password, name});
            router.replace('/');
        } catch(error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <View className="bg-white rounded-lg p-5 mt-5 gap-10">

      <Custominput
        label="Full name"
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => 
          setForm((prev) => ({ ...prev, name: text }))}
      />
      
      {/* Email Input */}
      <Custominput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
      />

      {/* Password Input */}
      <Custominput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        // secureTextEntry={true}
      />

      {/* Submit Button */}
      <CustomButton
        title="Sign Up"
        isLoading={isSubmitting}
        onPress={submit}
      />

      {/* Link to Sign Up */}
      <View className="flex-row items-center gap-2">
        <Text className="base-regular text-gray-500">
          Already have an account?
        </Text>

        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>

    </View>
  );
}

export default Signup