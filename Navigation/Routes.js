import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {LoadingScreen} from '../src/screens';
import { firebase } from '../src/firebase/config';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Routes = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  //controlla se l'utente é loggato oppure no, salva i suoi dati e fornisce direttive per la navigazione
  useEffect(async () => {
    const subscriber = await firebase.auth().onAuthStateChanged((user) => onChange(user));
    return subscriber;
  }, []);

  const onChange = async (user) => {
      if (user) {
        setLoading(true);
        await firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((document) => {
            const userData = document.data();
            setUser(userData);
            if(document.data() !== undefined){
              setIsSignedIn(true);
            } else {
              onChange(user);
            }
            setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          alert(error);
        });
      }else{
        setLoading(false);
        setIsSignedIn(false);
      }
  }

  if(loading) {
    return(
      <LoadingScreen />
    )
  }

  return (
    <NavigationContainer>
        {isSignedIn ? 
            <AppStack user = {user}/>
        : 
        <AuthStack />
        }
    </NavigationContainer>
  );
}

export default Routes; 