import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {firebase} from '../firebase/config';
import { icons } from '../../constants';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get("window");

const UserDetailsAnonymous = (props) => {
    const [fullName, setfullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const checkData = async () => {
        if(fullName === ''){
            Alert.alert("Dati errati","Inserisci un' username!");
            return;
        }
        if(!props.validateEmail(email)){
            Alert.alert('Dati errati', 'formato email errato');
            return;
        }
        if(password.length < 6){
            Alert.alert('Dati errati','La password deve avere piu di 6 caratteri');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Dati errati', "La password non corrisponde")
            return
        }
        await createUser();
        setLoading(false);
        props.navigation.navigate('Home')
    }

    const createUser = async () => {
        var credential = firebase.auth.EmailAuthProvider.credential(email, password)
        setLoading(true);
        await firebase
        .auth()
        .currentUser
        .linkWithCredential(credential)
        .then(async (response) => {
            const uid = response.user.uid
            const data = {
                id: uid,
                email,
                fullName,
                pfp: "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"
            };
            const usersRef = await firebase.firestore().collection('users');
            usersRef
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

    return(
        <View style = {{flex: 1, backgroundColor: "#F9FAF4", height: height }}>
            <View style = {{
                    backgroundColor: '#639F86',
                    height: 56,
                    justifyContent: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}
            >
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress = {() => props.navigation.openDrawer()}
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
                    <Text style = {{paddingLeft: width * 0.07, color: '#fff', fontWeight: 'bold', fontSize: 19, flex: 1}}>
                        Dettagli utente
                    </Text>
                    <TouchableOpacity
                        onPress = {() => updateData()}
                        style = {{alignItems: 'flex-end'}}
                    >
                    </TouchableOpacity>
                </View>
            </View>
            <Text style = {{textAlign: 'center', padding: 10, fontSize: 19, fontWeight: 'bold'}}>
                Vuoi creare un nuovo account?
            </Text>
            <View>
                <Text style = {{padding: 10, fontSize: 13}}>
                    Inserisci le credenziali negli appositi spazi
                </Text>
                <View style = {styles.action}>
                    <FontAwesome name = 'user-o'size = {20} />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder = 'username'
                        placeholderTextColor="#696969"
                        value = {fullName}
                        onChangeText = {(username) => setfullName(username)}
                    />
                </View>
                <View style = {styles.action}>
                    <MaterialCommunityIcons name = 'email-outline' size = {20} />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder = 'email'
                        placeholderTextColor="#696969"
                        value = {email}
                        onChangeText = {(email) => setEmail(email)}
                    />
                </View>
                <View style = {styles.action}>
                    <FastImage 
                        source = {icons.password}
                        style = {{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                        }}
                    />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder = 'password'
                        secureTextEntry
                        placeholderTextColor="#696969"
                        value = {password}
                        onChangeText = {(password) => setPassword(password)}
                    />
                </View>
                <View style = {styles.action}>
                    <FastImage 
                        source = {icons.password}
                        style = {{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                        }}
                    />
                    <TextInput 
                        style = {styles.textInput}
                        placeholder = 'conferma password'
                        secureTextEntry
                        placeholderTextColor="#696969"
                        value = {confirmPassword}
                        onChangeText = {(confirmPassword) => setConfirmPassword(confirmPassword)}
                    />
                </View>
                <TouchableOpacity style={styles.commandButton} onPress={() => {checkData()}}>
                    <Text style={styles.panelButtonTitle}>Invia</Text>
                </TouchableOpacity>
            </View>
            <Spinner 
                visible = {loading}
                //textContent = {'Aspetta...'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    action: {
        flexDirection: 'row',
        margin: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        //paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: 'black',
        paddingBottom: 0
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    commandButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#FEC12A',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15
    },
})

export default UserDetailsAnonymous;