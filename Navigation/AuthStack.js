import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, RegistrationScreen,} from '../src/screens';

const Stack = createStackNavigator();

const AuthStack = () => {

    return (
    <Stack.Navigator screenOptions = {{headerShown: false}}>
        <Stack.Screen name = "Login" component={LoginScreen} />
        <Stack.Screen name = "Registration" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack; 