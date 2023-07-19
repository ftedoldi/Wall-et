import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '../firebase/config';
import {images} from '../../constants'
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = async () => {
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                alert(error);
            })
    }
    
    const onRegisterAnonymousPress = async () => {
        await firebase
        .auth()
        .signInAnonymously()
        .then(async (response) => {
            const uid = response.user.uid;
            const data = {
                id: uid,
                fullName: 'utente',
                pfp: "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"
            };
            await firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .set(data)
            .catch((error) => {
                alert(error)
            });
        })
        .catch((error) =>{
            alert(error)
        });
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source = {images.splash}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Non hai un account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Registrati</Text></Text>
                </View>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Non vuoi registrarti? <Text onPress={onRegisterAnonymousPress} style={styles.footerLink}>Accedi in modo anonimo</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {

    },
    logo: {
        flex: 1,
        height: height * 0.18,
        width: "70%",
        alignSelf: "center",
        margin: height * 0.045,
    },
    input: {
        height: height * 0.07,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: height * 0.015,
        marginBottom: height * 0.015,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: height * 0.03,
        height: height * 0.07,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: width * 0.04,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: height * 0.03
    },
    footerText: {
        fontSize: width * 0.04,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: width * 0.04
    }
})