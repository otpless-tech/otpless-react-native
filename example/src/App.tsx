import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import HomeScreen from './Home';
import HeadlessScreen from './HeadlessScreen';
import React from 'react';

const App = () => {
  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'white',
  };

  const Stack = createStackNavigator();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor='white'
      />
        <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Headless" component={HeadlessScreen} />
      </Stack.Navigator>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
    </NavigationContainer>
  </SafeAreaView>
  );
};

export default App;