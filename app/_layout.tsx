import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";
import { useColorScheme } from "react-native";
import { RoutineProvider } from "./context/RoutineContext";
import i18n from "./i18n";

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
        headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <RoutineProvider>
        <ActionSheetProvider>
          <RootLayoutNav />
        </ActionSheetProvider>
      </RoutineProvider>
    </I18nextProvider>
  );
}
