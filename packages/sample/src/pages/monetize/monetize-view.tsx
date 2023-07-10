import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MonetizeProductsView } from './views/monetize-products-view';
import { MonetizePurchasesView } from './views/monetize-purchases-view';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';

export const MonetizeView = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize;

          if (route.name === 'Products') {
            iconName = 'list';
            iconSize = focused ? size : size - 4;
          } else if (route.name === 'Purchases') {
            iconName = 'shopping-cart';
            iconSize = focused ? size : size - 4;
          }

          return <Icon name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: 'darkcyan',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Products" component={MonetizeProductsView} />
      <Tab.Screen name="Purchases" component={MonetizePurchasesView} />
    </Tab.Navigator>
  );
};
