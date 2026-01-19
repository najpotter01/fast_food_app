import useAuthStore from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "./globals.css";

/* =======================
   Sentry Init (นอก component)
   ======================= */
Sentry.init({
  dsn: "https://30c9fd9dc07219fb321cd9c127207793@o4510462651793408.ingest.de.sentry.io/4510474531897424",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

/* =======================
   SplashScreen
   ======================= */
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, fontError] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  /* ===== Fetch auth session ===== */
  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  /* ===== Handle SplashScreen ===== */
  useEffect(() => {
    if (fontError) {
      // ❗ error จริง → ส่งเข้า Sentry
      Sentry.captureException(fontError);
      throw fontError;
    }

    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading, fontError]);

  /* ===== Loading state ===== */
  if (!fontsLoaded || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

/* =======================
   Wrap with Sentry
   ======================= */
export default Sentry.wrap(RootLayout);
