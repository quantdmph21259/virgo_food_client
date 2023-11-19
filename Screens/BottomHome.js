import React from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ContainerSetting from "./Settings/ContainerSetting";
import ContainerCategory from "./Category/ContainerCategory";
import ContainerCart from "./Cart/ContainerCart";
import ContainerOrder from "./Order/ContainerOrder";
import ContainerHome from "./Home/ContainerHome";
import ScreenName from "../controllers/ScreenName";
import Color from "../controllers/Color";

const BottomHome = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={ScreenName.containerHome}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName = "";
          if (route.name == ScreenName.containerHome) {
            iconName = focused ? "ios-home" : "ios-home-outline";
            size = focused ? size + 7 : size + 3;
          } else if (route.name == ScreenName.containerCategory) {
            iconName = focused ? "ios-list" : "ios-list-outline";
            size = focused ? size + 7 : size + 3;
          } else if (route.name == ScreenName.containerCart) {
            iconName = focused ? "cart" : "cart-outline";
            size = focused ? size + 7 : size + 3;
          } else if (route.name == ScreenName.containerOrder) {
            iconName = focused ? "time" : "time-outline";
            size = focused ? size + 7 : size + 3;
          } else if (route.name == ScreenName.containerSetting) {
            iconName = focused ? "md-settings" : "md-settings-outline";
            size = focused ? size + 7 : size + 3;
          }

          return <Ionic name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: `${Color.activeBottomBar}`,
        tabBarInactiveTintColor: `${Color.inActiveBottomBar}`,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name={ScreenName.containerHome} component={ContainerHome} />
      <Tab.Screen
        name={ScreenName.containerCategory}
        component={ContainerCategory}
      />
      <Tab.Screen name={ScreenName.containerCart} component={ContainerCart} />
      <Tab.Screen name={ScreenName.containerOrder} component={ContainerOrder} />
      <Tab.Screen
        name={ScreenName.containerSetting}
        component={ContainerSetting}
      />
    </Tab.Navigator>
  );
};

export default BottomHome;
