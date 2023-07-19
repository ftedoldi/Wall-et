import React from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get("window");

export default TutorialItems = ({item}) => {
    return(
        <View style = {{flex: 1, backgroundColor: 'rgba(33, 33, 33, 0.8)'}}>
            <Image source = {item.image} style = {[styles.image, {width, resizeMode: 'contain'}]}/>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
    }
})