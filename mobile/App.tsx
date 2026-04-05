import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PlusCircle, LayoutDashboard } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import HomeScreen from './src/screens/HomeScreen';
import SubmitScreen from './src/screens/SubmitScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size, focused }) => {
              let IconComponent;
              if (route.name === 'Home') IconComponent = Home;
              else if (route.name === 'Submit') IconComponent = PlusCircle;
              else if (route.name === 'Dashboard') IconComponent = LayoutDashboard;

              return (
                <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                  {IconComponent && <IconComponent color={focused ? '#fff' : '#94a3b8'} size={24} />}
                </View>
              );
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#94a3b8',
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
          })}
          screenListeners={{
            tabPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Submit" component={SubmitScreen} />
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
    elevation: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 70,
    borderTopWidth: 0,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: Platform.OS === 'ios' ? 10 : 0, 
  },
  activeIconContainer: {
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  }
});
