import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { Redirect, Slot } from "expo-router";
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Redirect href="/" />;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero / Image Section */}
        <View
          className="relative w-full"
          style={{ height: height * 0.45 }}
        >
          <ImageBackground
            source={images.loginGraphic}
            className="w-full h-full rounded-b-3xl"
            resizeMode="cover"
          />

          {/* Logo */}
          <View className="absolute -bottom-20 w-full items-center">
            <Image
              source={images.logo}
              className="w-40 h-40"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Content */}
        <View className="mt-24 px-6 pb-10">
          {/* Title */}
          <Text className="text-3xl font-extrabold text-center text-gray-900">
            Welcome Back 👋
          </Text>

          {/* Subtitle */}
          <Text className="text-base text-center text-gray-500 mt-2">
            Sign in to continue using the app
          </Text>

          {/* Slot (Login / Register Form) */}
          <View className="mt-8">
            <Slot />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
