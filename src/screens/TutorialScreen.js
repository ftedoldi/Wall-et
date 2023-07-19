import React, {useRef, useState} from 'react';
import {View, FlatList, Animated} from 'react-native';
import slides from '../../slides';
import TutorialItems from '../../components/TutorialItems'
import Paginator from '../../components/Paginator'

const TutorialScreen = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const firstLunch = () => {
        return props.setFirstLunch();
    }

    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index);
    }).current

    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

    return(
        <View style = {{flex: 1, backgroundColor: "#212121"}}>
            <FlatList 
                data = {slides}
                renderItem = {({item}) => <TutorialItems item = {item}/>}
                horizontal
                showsHorizontalScrollIndicator = {false}
                pagingEnabled
                bounces = {false}
                keyExtractor = {(item) => item.id}
                onScroll = {Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                    useNativeDriver: false,
                })}
                scrollEventThrottle = {32}
                onViewableItemsChanged = {viewableItemsChanged}
                viewabilityConfig = {viewConfig}
                ref = {slidesRef}
            />
            <Paginator data = {slides} scrollX = {scrollX} currentIndex = {currentIndex} slidesRef = {slidesRef} firstLunch = {firstLunch}/>
        </View>
        
    )
}
//onPress = {() => props.setFirstLunch()}
export default TutorialScreen;