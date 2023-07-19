import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
    Avatar,
    Title,
    Drawer,
    Caption
} from 'react-native-paper';
import {
    DrawerContentScrollView,
} from '@react-navigation/drawer';
import {icons} from '../../constants';
import {firebase} from '../firebase/config';


const DrawerContent = (props) => {
    const userEmail = props.extraData.email;
    const userFullName = props.extraData.fullName;
    const userPfp = props.extraData.pfp;

    const [userName, setUserName] = useState(userFullName);
    const [email, setEmail] = useState(userEmail);
    const [pfp, setPfp] = useState(userPfp);

    const userID = props.extraData.id;
    const userRef = firebase.firestore().collection('users').doc(userID);

    useEffect(() => {
        const unsubscribe = userRef
        .onSnapshot((doc) =>{
            setUserName(doc.data().fullName);
        }, (error) => {
            alert(error)
        })
        
        return () => {
            unsubscribe()
        };
    }, [userName])
    
    useEffect(() => {
        const unsubscribe = userRef
        .onSnapshot((doc) =>{
            setEmail(doc.data().email);
        }, (error) => {
            alert(error)
        })
        
        return () => {
            unsubscribe()
        };
    }, [email])

    useEffect(() => {
        const unsubscribe = userRef
        .onSnapshot((doc) =>{
            setPfp(doc.data().pfp)
        }, (error) => {
            alert(error)
        })
        
        return () => {
            unsubscribe()
        };
    }, [pfp])

    //esegue il log out dell'utente
    const onLogOutPress = async () =>{
        await firebase
        .auth()
        .signOut()
        .catch((error) => {
            alert(error);
        })
    }

    return(
        <View style = {{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <View style = {styles.drawerContent}>
                    <View style = {styles.userInfoSection}>
                        <View style = {{marginTop: 15, flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress = {() => props.navigation.navigate('UserDetails')}
                            >
                                <Avatar.Image 
                                    style = {{marginTop: 2}}
                                    source = {{
                                        uri: pfp
                                    }}
                                    size = {50}
                                    
                                />
                            </TouchableOpacity>
                            <View style = {{marginLeft: 15}}>
                                <Title style = {styles.title}>
                                    {userName}
                                </Title>
                                <Caption style = {styles.caption}>
                                    {email}
                                </Caption>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style = {styles.drawerSection}>
                        <TouchableOpacity
                            onPress = {() => props.navigation.navigate("Home")}
                        >
                            <Drawer.Item
                                icon = {icons.home}
                                label = "Home"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress = {() => props.navigation.navigate("UserDetails")}
                        >
                            <Drawer.Item
                                icon = {icons.user}
                                label = "Profilo"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress = {() => props.navigation.navigate("Charts")}
                        >
                            <Drawer.Item
                                icon = {icons.barChart}
                                label = "Grafici"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress = {() => props.navigation.navigate("Record")}
                        >
                            <Drawer.Item
                                icon = {icons.record}
                                label = "Record"
                            />
                        </TouchableOpacity>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style = {styles.bottomDrawerSection}>
                <TouchableOpacity
                    onPress = {() => onLogOutPress()}
                >
                    <Drawer.Item
                        icon = {icons.signOut}
                        label = "Sign out"
                    />
                </TouchableOpacity>
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent:{
        flex:1
    },
    userInfoSection: {
        paddingLeft: 20
    },
    title: {
        fontSize: 16,
        marginTop: 0,
        fontWeight: 'bold'
    },
    drawerSection: {
        marginTop: 15
    },
    caption: {
        fontSize: 14,
        lineHeight: 14
    },
    bottomDrawerSection: {
        marginTop: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    }
})

export default DrawerContent;