import React from 'react';
import {View, ActivityIndicator, StyleSheet, Dimensions, Image} from 'react-native';
import {images} from '../../constants';

const { width, height } = Dimensions.get("window");

const LoadingScreen = () => {
    return(
        <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: "#F9FAF4"}}>
            <Image
                style={styles.logo}
                source = {images.splash}
            />
            <ActivityIndicator 
                size = "large"
                color= "#000"
            />
        </View>
    )
}
const styles = StyleSheet.create({
    logo: {
        height: height * 0.05,
        width: "70%",
        alignSelf: "center",
        margin: height * 0.045,
        marginTop: height * 0.07
    }
})

export default LoadingScreen;