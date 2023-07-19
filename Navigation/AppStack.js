import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {TouchableOpacity, Dimensions} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, ChartsScreen, DrawerContent, UserDetails, RecordScreen, TutorialScreen, LoadingScreen } from '../src/screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeStack = createStackNavigator();
const ChartStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const UserStack = createStackNavigator();
const RecordStack = createStackNavigator();

const { width, height } = Dimensions.get("window");

const AppStack = (prop) => {

    const [isFirstLaunch, setIsFirstLaunch] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('isAlreadyLoggedIn4').then((value) => {
          if (value === null) {
            AsyncStorage.setItem('isAlreadyLoggedIn4', 'true');
            setIsFirstLaunch(true);
          } else {
            setIsFirstLaunch(false);          }
        });
    }, []);

    if(isFirstLaunch === null) {
        <LoadingScreen />
    }

    const functLunch = () => {
        setIsFirstLaunch(false);
    }

    const HomeStackScreen = ({navigation}) =>{
        return(
        <HomeStack.Navigator screenOptions = {{
            headerStyle: {
            backgroundColor: '#639F86',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'
            }
        }}>
            <HomeStack.Screen name = "Home" options = {{
            title: 'Home',
            headerLeft: () =>(
                <TouchableOpacity
                onPress = {() => navigation.openDrawer()}
                >
                <MaterialCommunityIcons
                    style = {{
                        marginLeft: width * 0.02
                    }}
                    name = 'menu'
                    size = {27}
                    color = 'white'
                />
                </TouchableOpacity>
            )
            }}>
            {props => <HomeScreen {...props} extraData = {prop.user} />}
            </HomeStack.Screen>
        </HomeStack.Navigator>
        )
    }

    const RecordStackScreen = ({navigation}) => {
    return(
        <RecordStack.Navigator screenOptions = {{
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        },
        headerLeft: () =>(
            <TouchableOpacity
            onPress = {() => navigation.openDrawer()}
            >
            <MaterialCommunityIcons
                style = {{
                    marginLeft: width * 0.02
                }}
                name = 'menu'
                size = {27}
                color = 'white'
            />
            </TouchableOpacity>
        )}}>
        <RecordStack.Screen name = "RecordScreen" options = {{headerShown: false}}>
            {props => <RecordScreen {...props} extraData = {prop.user} />}
            </RecordStack.Screen>
        </RecordStack.Navigator>
    )
    }

    const ChartStackScreen = ({navigation}) =>{
    return(
        <ChartStack.Navigator screenOptions = {{
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        },
        headerLeft: () =>(
            <TouchableOpacity
            onPress = {() => navigation.openDrawer()}
            >
            <MaterialCommunityIcons
                style = {{
                    marginLeft: width * 0.02
                }}
                name = 'menu'
                size = {27}
                color = 'white'
            />
            </TouchableOpacity>
        )}}>
        <ChartStack.Screen name = "Grafici" options = {{headerStyle : {height: 56, backgroundColor: '#639F86'}}}>
            {props => <ChartsScreen {...props} extraData = {prop.user} />}
        </ChartStack.Screen>
        </ChartStack.Navigator>
    )
    }

    const UserDetailStackScreen = ({navigation}) =>{
    return(
        <UserStack.Navigator screenOptions = {{
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        },
        headerLeft: () =>(
            <TouchableOpacity
            onPress = {() => navigation.openDrawer()}
            >
            <MaterialCommunityIcons
                style = {{
                    marginLeft: width * 0.02
                }}
                name = 'menu'
                size = {27}
                color = 'white'
            />
            </TouchableOpacity>
        )}}>
        <UserStack.Screen name = "Profilo Utente">
            {props => <UserDetails {...props} extraData = {prop.user} />}
        </UserStack.Screen>
        </UserStack.Navigator>
    )
    }

  return (
      isFirstLaunch === true? 
        <TutorialScreen setFirstLunch = {() => functLunch()}/> 
      : 
        <Drawer.Navigator initialRouteName = 'Home' drawerContent = {props => <DrawerContent {...props} extraData = {prop.user}/>}>
            <Drawer.Screen name = "Home" component = {HomeStackScreen}/>
            <Drawer.Screen name = "Charts" component = {ChartStackScreen}/>
            <Drawer.Screen name = "UserDetails" component = {UserDetailStackScreen}/>
            <Drawer.Screen name = "Record" component = {RecordStackScreen}/>
        </Drawer.Navigator>
  );
}

export default AppStack;