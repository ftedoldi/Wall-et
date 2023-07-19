import React, {useRef} from 'react';
import {View, Dimensions, StyleSheet, Animated, Text, TouchableOpacity} from 'react-native';
import slides from '../slides';

const {width, height} = Dimensions.get("window");

export default Paginator = ({ data, scrollX, currentIndex, slidesRef, firstLunch }) => {

    const scrollTo = () => {
        if(currentIndex < slides.length - 1){
            slidesRef.current.scrollToIndex({ index: currentIndex + 1});
        } else {
            firstLunch()
        }
    }

    const scrollBack = () => {
        if(currentIndex !== 0 ){
            slidesRef.current.scrollToIndex({ index: currentIndex - 1});
        }
    }
    return(
        <View style = {{height: 50}}>
            <View style = {{flexDirection: 'row', justifyContent: 'center', top: 10}}>
                {data.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [7, 15, 7],
                        extrapolate: 'clamp'
                    })

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })
                    return <Animated.View style = {[styles.dot, {width: dotWidth, opacity}]} key = {i.toString()}/>;
                })}
            </View>
            <View style = {{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <TouchableOpacity 
                    style = {{position: 'absolute', bottom: 10, left: 10}}
                    onPress = {() => scrollBack()}
                >
                    <Text style = {{color: 'green', fontSize: 16}}>
                        Indietro
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style = {{position: 'absolute', bottom: 10, right: 10}}
                    onPress = {() => scrollTo()}
                >
                    <Text style = {{color: 'green', fontSize: 16}}>
                        Avanti
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    dot: {
        height: 7,
        borderRadius: 5,
        backgroundColor: 'green',
        marginHorizontal: 8
    }
})