// app.config.js
import 'dotenv/config';

export default {
  expo: {
    splash: {
      image: "./assets/task/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
      dark: {
        backgroundColor: "#000000"
      }
    },
    extra: {
      DOMAIN_URL: process.env.DOMAIN_URL || "http://localhost:3000",
      // Puedes agregar más variables aquí si las necesitas
      // EJEMPLO: API_KEY: process.env.API_KEY || "",
    },
    name: "AppTask",
    slug: "AppTask",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/task/icon.png",
    scheme: "apptask",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.AppTask"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.AppTask"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/task/icon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/task/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    }
  }
};
