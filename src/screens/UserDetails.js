import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Dimensions,
    Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '../firebase/config';
import FastImage from 'react-native-fast-image';
import { icons } from '../../constants';
import {UserDetailsAnonymous} from '../screens';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import {TextInput} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get("window");

const UserDetails = (props) => {
    const userPfp = props.extraData.pfp;
    const userUserName = props.extraData.fullName;
    //const userEmail = props.extraData.email;

    //const [email, setEmail] = useState(userEmail);
    const [userName, setUsername] = useState(userUserName);
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisiblePfp, setModalVisiblePfp] = useState(false);
    //const [updatingPassword, setUpdatingPassword] = useState(false);
    const [image, setImage] = useState(null);
    const [pfp, setPfp] = useState(userPfp);
    const [loading, setLoading] = useState(false);

    const userID = props.extraData.id;
    const userRef = firebase.firestore().collection('users').doc(userID);

    /*useEffect(async () => {
        const unsubscribe = await userRef
        .onSnapshot((doc) => {
            setEmail(doc.data().email);
        }, (error) => {
            alert(error)
        })
        return () => {
            unsubscribe()
        };
        
    }, []);*/

    useEffect(async () => {
        const unsubscribe = await userRef
        .onSnapshot((doc) => {
            setUsername(doc.data().fullName);
        }, (error) => {
            alert(error)
        })
        return () => {
            unsubscribe()
        };
        
    }, []);

    useEffect(async () => {
        const unsubscribe = await userRef
        .onSnapshot((doc) => {
            setPfp(doc.data().pfp);
        }, (error) => {
            alert(error)
        })
        return () => {
            unsubscribe()
        };
        
    }, []);

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const takePhotoFromCamera = () =>{
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
        })
        .then(image => {
            setImage(image.path);
            setPfp(image.path)
            setModalVisiblePfp(false);
        })
        .catch((error) => {
            alert(error);
        });
    }

    const choosePhotoFromLibrary = async () =>{
        await ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        })
        .then(image => {
            setImage(image.path)
            setPfp(image.path)
            setModalVisiblePfp(false);
        })
        .catch((error) => {
            alert(error);
        });

    }

    const renderModal = () => {
        return(
            <Modal
                style = {{
                    alignItems: 'center'
                }}
                animationIn = 'fadeIn'
                animationOut = 'fadeOut'
                backdropTransitionOutTiming = {0}
                isVisible={modalVisible}
                hasBackdrop={true}
                backdropOpacity={0.5}
                backdropColor={'rgba(0, 0, 0, 0.8)'}
                backdropTransitionInTiming = {0}
                backdropTransitionOutTiming = {0}
                onBackdropPress={() => {
                    setModalVisible(false);
                }}
            >   
                <View style = {{backgroundColor: '#F9FAF4', borderRadius: 10, width: width * 0.6}}>
                    <View style = {{
                        height: height * 0.3, 
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <Text style = {{marginTop: height * 0.03, fontWeight: 'bold'}}>
                            INSERISCI LA VECCHIA PASSWORD
                        </Text>
                        <TextInput
                            style = {{
                                width: width * 0.5,
                                height: height * 0.04,
                            }}
                            onChangeText = {(password) => setOldPassword(password)}
                            secureTextEntry
                        />
                        <TouchableOpacity
                            style={[styles.commandButton, {marginBottom: 10}]}
                            onPress = {() => /*updatingPassword? */updatePassword() /*: updateEmail()*/}
                        >
                            <Text style={styles.panelButtonTitle}>
                                Ok
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    const renderModalPfp = () => {
        return (
            <Modal
                isVisible={modalVisiblePfp}
                backdropTransitionOutTiming = {0}
                onSwipeComplete={() => setModalVisiblePfp(false)}
                swipeDirection="down"
                hasBackdrop={true}
                deviceHeight={height}
                deviceWidth={width}
                backdropOpacity={0.5}
                backdropColor={'rgba(0, 0, 0, 0.8)'}
                style = {{justifyContent: 'flex-end', margin: 0}}
                onBackdropPress={() => {
                    setModalVisiblePfp(false);
                }}
            >
                <View style = {{backgroundColor: '#fff', height: 300, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                    <Text style = {{fontSize: 20, textAlign: 'center', marginTop: 15, fontWeight: 'bold', paddingBottom: 15}}>
                        SELEZIONA UN' AZIONE
                    </Text>
                    <TouchableOpacity style={styles.commandButton} onPress={() => {takePhotoFromCamera()}}>
                        <Text style={styles.panelButtonTitle}>Scatta una foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.commandButton} onPress={() => {choosePhotoFromLibrary()}}>
                        <Text style={styles.panelButtonTitle}>Carica una foto dalla galleria</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.commandButton} onPress={() => {setModalVisiblePfp(false)}}>
                        <Text style={styles.panelButtonTitle}>Cancella</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
      };

    const handleUpdate = async() => {
        let imgUrl = await uploadImage();
        if(imgUrl == null) {
          imgUrl = pfp;
        }
        setPfp(imgUrl);
        userRef
        .update({
          pfp: imgUrl
        })
        .then(() => {
        })
    }

    const uploadImage = async () => {
        if(image === null){
            return null;
        }
        const uploadUri = image;

        var metadata = {
            contentType: 'image/jpeg',
        };
        
        setLoading(true);

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = (e) => {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uploadUri, true);
            xhr.send(null);
        });
    
        const storageRef = firebase.storage().ref(`photos/${userID}`);
        const task = storageRef.put(blob, metadata);
        try {
            await task;

            const url = await storageRef.getDownloadURL();

            setImage(null);
            setLoading(false);

            /*Alert.alert(
                'Immagine cambiata',
                'La tua immagine e stata cambiata con successo!',
            );*/
            return url;

            } catch (e) {
                alert(e);
                return null;
            }
    }

    const updateData = async () => {
        /*let emailFirebase = ''
        await userRef.get().then((doc) => emailFirebase = doc.data().email).catch((error) => {alert(error)});
        if(email !== emailFirebase){
            if(validateEmail(email)){
                setModalVisible(true);
            } else {
                alert('formato email errato');
                return;
            }
        }*/
        setLoading(true);
        await userRef
        .update({
            fullName: userName
        })
        .catch((error) => {
            alert(error)
        })

        await handleUpdate();
        setLoading(false);
        setOldPassword('');
        props.navigation.navigate('Home');
    }

    /*const updateEmail = async () => {
        setLoading(true);
        var user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email, 
            oldPassword
        );

        await user.reauthenticateWithCredential(credential)
        .catch((error) => {
            alert(error)
            return;
        });

        await user.updateEmail(email).then(function() {
            alert('update email eseguito con successo')
        })
        .catch((error) => {
            alert(error)
        });

        await userRef
        .update({
            email: email,
        })
        .catch((error) => {
            alert(error)
        })
        setLoading(false);
        setModalVisible(false);
        //props.navigation.navigate('Home');
    }*/

    const updatePassword = async () => {
        if(password === confirmPassword){
            setLoading(true);
            var user = firebase.auth().currentUser;
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email, 
                oldPassword
            );

            await user.reauthenticateWithCredential(credential)
            .then(function(){
                user.updatePassword(password).then(function() {
                    alert('password cambiata con successo')
                }).catch((error) => {
                    alert(error)
                });
            })
            .catch((error) => {
                alert(error);
            });

            setOldPassword('');
            setPassword('');
            setConfirmPassword('');
            setModalVisible(false);
            setLoading(false);
            props.navigation.navigate('Home');
        }else {
            alert('La password non corrisponde')
        }
    }

    return(
        <View style = {{flex: 1, backgroundColor: "white"}}>
            {firebase.auth().currentUser.isAnonymous?
            (
                <UserDetailsAnonymous {...props} validateEmail = {validateEmail}/>)
            :
            (
                <>
            <ScrollView style = {styles.container}>
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
                            <Ionicons style = {{marginRight: width * 0.07}} name = "checkmark" size = {27} color = "white"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView style = {{margin: 15}}>
                    <View style = {{alignItems: 'center'}}>
                        <TouchableOpacity onPress = {() => {setModalVisiblePfp(true)}}>
                            <View style = {{
                                height: 120,
                                width: 120,
                                borderRadius: 15,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <ImageBackground 
                                    source = {{
                                        uri: pfp
                                    }}
                                    style = {{height: 120, width: 120}}
                                    imageStyle = {{borderRadius: 15}}
                                >
                                    <View style = {{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <MaterialCommunityIcons name = 'camera' size = {35} color = '#fff' style = {{
                                            opacity: 0.7,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}/>
                                    </View>
                                    </ImageBackground>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style = {{paddingTop: height * 0.02, fontSize: 16, fontWeight: 'bold'}}>
                        MODIFICA LE INFORMAZIONI PERSONALI
                    </Text>
                    <View style = {styles.action}>
                        <FontAwesome name = 'user-o'size={20} />
                        <TextInput 
                            style = {styles.textInput}
                            placeholder = 'username'
                            autoCapitalize="none"
                            placeholderTextColor="#696969"
                            theme = {{colors: {text: 'black', primary: 'black'}}}
                            underlineColor='#A9A9A9'
                            value = {userName}
                            onChangeText = {(username) => setUsername(username)}
                        />
                    </View>
                    {/*<Text style = {{paddingTop: height * 0.02, fontSize: 16, fontWeight: 'bold'}}>
                        MODIFICA L'EMAIL
                    </Text>
                    <View style = {styles.action}>
                        <MaterialCommunityIcons name = 'email-outline' size={20} />
                        <TextInput 
                            style = {styles.textInput}
                            placeholder = 'email'
                            autoCapitalize="none"
                            placeholderTextColor="#696969"
                            theme = {{colors: {text: 'black', primary: 'black'}}}
                            underlineColor='#A9A9A9'
                            value = {email}
                            onChangeText = {(email) => setEmail(email)}
                        />
                        <Ionicons name = "checkmark-circle-outline" size = {30} color = "black"/>
                                    </View>*/}
                    <Text style = {{paddingTop: height * 0.02, fontSize: 16, fontWeight: 'bold'}}>
                        MODIFICA LA PASSWORD
                    </Text>
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
                            secureTextEntry
                            placeholder = "Nuova password"
                            autoCapitalize="none"
                            placeholderTextColor="#666666"
                            theme = {{colors: {text: 'black', primary: 'black'}}}
                            underlineColor='#A9A9A9'
                            onChangeText ={(password) => setPassword(password)}
                            value = {password}
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
                            secureTextEntry
                            placeholder = "Conferma password"
                            autoCapitalize="none"
                            placeholderTextColor="#666666"
                            theme = {{colors: {text: 'black', primary: 'black'}}}
                            underlineColor='#A9A9A9'
                            onChangeText ={(password) => setConfirmPassword(password)}
                            value = {confirmPassword}
                        />
                    </View>
                <TouchableOpacity 
                    style={styles.commandButton} 
                    onPress={() => {(password !== '' && confirmPassword !== '' && password.length >= 6 && password === confirmPassword)
                    ? 
                        [setModalVisible(true)/*, setUpdatingPassword(true)*/]
                    : 
                        alert('dati errati')}}>
                    <Text style={styles.panelButtonTitle}>Modifica la password</Text>
                </TouchableOpacity>
                {renderModal()}
                {renderModalPfp()}
                <Spinner 
                    visible = {loading}
                />
            </KeyboardAwareScrollView>
            </ScrollView>
            </>
            )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#F9FAF4",
      flex: 1
    },
    commandButton: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#FEC12A',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: width * 0.1,
        marginRight: width * 0.1,
    },
    commandButtonModal: {
        padding: height * 0.012,
        borderRadius: 10,
        backgroundColor: '#FEC12A',
        alignItems: 'center',
        marginTop: height * 0.015,
        marginLeft: width * 0.05,
        marginRight: width * 0.05,
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 8,
        },
        shadowOpacity: 0.46,
        shadowRadius: 11.14,
        elevation: 17,
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -3},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      alignItems: 'center'
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        backgroundColor: '#F9FAF4',
        marginLeft: 5,
        height: 32,
        paddingTop: 10,
    },
    modalBox: {
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        height,
        width,
        backgroundColor: "transparent"
    },
    content: {
        height: height * 0.82,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white"
    },
})

export default UserDetails;