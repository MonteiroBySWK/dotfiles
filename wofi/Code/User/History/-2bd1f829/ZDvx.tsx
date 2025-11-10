import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as RNThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useColorScheme as RNUseColorScheme } from "react-native";

DefaultTheme.colors.background = "white";
DarkTheme.colors.background = "#09090B";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [loaded, setLoaded] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();
  const rnColorScheme = RNUseColorScheme();

  useEffect(() => {
    if (loaded) {
      (async () => {
        const theme = await AsyncStorage.getItem("theme");

        if (!theme) {
          const cs = rnColorScheme === "dark" ? "dark" : "light";

          await AsyncStorage.setItem("theme", cs);
          setColorScheme(cs);
          return;
        }

        if (colorScheme && theme !== colorScheme) {
          await AsyncStorage.setItem("theme", colorScheme);
          return;
        }
      })();
    }
  }, [colorScheme, loaded]);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");

      if (theme) {
        setColorScheme(theme as "light" | "dark");
      }

      setLoaded(true);
    })();
  }, []);

  const isDarkMode = useMemo(
    () => (!loaded && rnColorScheme === "dark") || colorScheme === "dark",
    [loaded, rnColorScheme, colorScheme]
  );

  return (
    <RNThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      {children}
    </RNThemeProvider>
  );
};
