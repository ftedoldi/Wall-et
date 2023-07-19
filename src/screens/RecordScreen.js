import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    LogBox
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {firebase} from '../firebase/config';
import { EditScreen } from '../screens';
import Modal from "react-native-modalbox";
import NumberFormat from 'react-number-format';
import { icons } from '../../constants';
import { Snackbar } from 'react-native-paper';

const { width, height } = Dimensions.get("window");

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const RecordScreen = (props) => {
    const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
    const [objectData, setObjectData] = useState({});
    const [record, setRecord] = useState([]);
    const [sevenDayVisible, setSevenDayVisible] = useState(true);
    const [thirtyDayVisible, setThirtyDayVisible] = useState(false);
    const [oneYearVisible, setOneYearVisible] = useState(false);
    const [allVisible, setAllVisible] = useState(false);
    const [spese, setSpese] = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);

    const userID = props.extraData.id;
    const prelievoRef = firebase.firestore().collection('users').doc(userID).collection('transitions');

    useEffect(() => {
        //modifica real time la lista di record
        const unsubscribe = prelievoRef
        .where("authorID", "==", userID)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
            querySnapshot => {
                const prel = []
                querySnapshot.forEach(doc =>{
                    const data = doc.data()
                    data.id = doc.id
                    prel.push(data)
                });
                setRecord(prel);
            },
            error =>{
                alert(error)
            }
        )
        return () => {
            unsubscribe()
        };
    }, []);

    function closeModalEdit() {
        setModalVisibleEdit(false);
    }

    function showSnackBar() {
        setSnackBarVisible(true);
    }

    function iconsMap (){
        const iconsMap = new Map();
        iconsMap.set("Casa", icons.casa);
        iconsMap.set("Cibo", icons.cibo);
        iconsMap.set("Entrate", icons.entrate);
        iconsMap.set("Extra", icons.extra);
        iconsMap.set("Tecnologia", icons.tecnologia);
        iconsMap.set("Viaggi", icons.viaggi);
        iconsMap.set("Trasporti", icons.trasporti);

        return iconsMap;
    }

    const getModalEdit = () => {
        return (
          <Modal
            entry="bottom"
            swipeArea = {height}
            swipeToClose = {true}
            backdropPressToClose={true}
            backButtonClose = {true}
            isOpen={modalVisibleEdit}
            style={styles.modalBox}
            coverScreen = {true}
            onClosed={() => setModalVisibleEdit(false)}
          >
            <View style={styles.content}>
                <EditScreen
                    {...props}
                    userID = {userID}
                    closeModalEdit = {closeModalEdit} 
                    iconsMap = {iconsMap}
                    objectData = {objectData}
                    showSnackBar = {showSnackBar}
                />
            </View>
          </Modal>
        );
      };
    
    const VisibleItem = props => {
        const {data} = props;
        const source = iconsMap().get(data.item.category)
        return (
            <View style = {styles.rowFront}>
                <TouchableHighlight
                    style = {styles.rowFrontVisible}
                >
                    <View style = {{flexDirection: 'row'}}>
                        {data.item.tag === "ricarica" ?(
                            <>
                                <View style = {{paddingLeft: width * 0.015}}>
                                    <FastImage 
                                        source = {source}
                                        style = {{
                                            width: 35,
                                            height: 40,
                                            resizeMode: 'contain',
                                        }}
                                    />
                                </View>
                                <View style = {{paddingLeft: width * 0.035}}>
                                    <Text style = {{fontSize: 17, fontWeight: 'bold'}}>
                                        {data.item.category}
                                    </Text>
                                    <Text style = {{color: '#666', fontSize: 15}}>
                                        {data.item.description}
                                    </Text>
                                </View>
                                <View style = {{flex: 1, paddingRight: width * 0.015}}>
                                    <NumberFormat 
                                        value={data.item.value.toFixed(1)}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'€'}
                                        renderText = {formattedValue => <Text 
                                                                            numberOfLines = {1}
                                                                            style = {{
                                                                                
                                                                                color: 'green',
                                                                                fontSize: 17,
                                                                                fontWeight: 'bold',
                                                                                textAlign: 'right'
                                                                            }} 
                                                                        >
                                                                            +{formattedValue}
                                                                        </Text>
                                                    }
                                        />
                                    <Text style = {styles.date} numberOfLines = {1}>
                                        {data.item.date}
                                    </Text>
                                </View>
                            </>
                            ) : (
                            <>
                                <View style = {{paddingLeft: width * 0.015}}>
                                    <FastImage 
                                        source = {source}
                                        style = {{
                                            width: 35,
                                            height: 40,
                                            resizeMode: 'contain'
                                        }}
                                    />
                                    <View style = {{backgroundColor: 'blue'}}>
                                        
                                    </View>
                                </View>
                                <View style = {{paddingLeft: width * 0.035}}>
                                    <Text style = {{fontSize: 17, fontWeight: 'bold'}}>
                                        {data.item.category}
                                    </Text>
                                    <Text style = {{fontSize: 15, color : '#666'}}>
                                        {data.item.description}
                                    </Text>
                                </View>
                                <View style = {{flex: 1, paddingRight: width * 0.015}}>
                                    <NumberFormat 
                                            value={data.item.value.toFixed(1)}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={'€'}
                                            renderText = {formattedValue => <Text 
                                                                                numberOfLines = {1}
                                                                                style = {{
                                                                                    color: 'red',
                                                                                    fontSize: 17,
                                                                                    fontWeight: 'bold',
                                                                                    textAlign: 'right'
                                                                                }} 
                                                                            >
                                                                                -{formattedValue}
                                                                            </Text>
                                        }
                                    />
                                    <Text style = {styles.date} numberOfLines = {1}>
                                    {data.item.date}
                                    </Text>
                                </View>
                            </>)
                        }
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    const renderItem = (data) => {
        return <VisibleItem data = {data}/>;
    };

    const HiddenItemWithAction = props => {
        const{onEdit, onDelete} = props;

        return(
            <View style = {styles.rowBack}>
                <TouchableOpacity style = {[styles.backRightBtn, styles.backRightBtnLeft]} onPress = {onEdit}>
                    <View style = {styles.trash}>
                        <MaterialCommunityIcons 
                            name = "pencil-outline"
                            size = {25}
                            color = "#fff"
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.backRightBtn, styles.backRightBtnRight]} onPress = {onDelete}>
                    <View style = {styles.trash}>
                        <MaterialCommunityIcons 
                            name = "trash-can-outline"
                            size = {25}
                            color = "#fff"
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    const renderHiddenItem = (data, rowMap) =>{
        return(
            <HiddenItemWithAction 
                data = {data}
                rowMap = {rowMap}
                onDelete = {() => deleteRow(rowMap, data.item.key)}
                onEdit = {() => editRow(rowMap, data.item.key)}
            />
        )
    };

    async function editRow (rowMap, rowKey) {
        if(rowMap[rowKey]){
            rowMap[rowKey].closeRow();
        }
        await prelievoRef
        .doc(rowKey)
        .get()
        .then((doc) => {
            setObjectData({
            value: doc.data().value,
            date: doc.data().date,
            category: doc.data().category,
            tag: doc.data().tag,
            id: rowKey,
            description: doc.data().description
        })
        })
        .catch((error) =>{
            alert(error)
        })
        setModalVisibleEdit(true);
    }

    //elimina la riga richiesta, modificando i dati nel database
    const deleteRow = async (rowMap, rowKey) =>{
        if(rowMap[rowKey]){
            rowMap[rowKey].closeRow();
        }
        await prelievoRef
        .doc(rowKey)
        .delete()
        .catch((error) => {
            alert(error)
        })
    }

    const returnData = (recordData) => {
        return recordData.map((el) => ({
            key: el.id,
            value: el.value,
            tag: el.tag,
            date: el.date,
            category: el.category,
            description: el.description
        }))
    }
    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    }

    function getDaysInYear(year){
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    }

    const dataListView = () => {
        let recordDataSpese = [];
        let recordDataEntrate = [];

        if(sevenDayVisible){
            for(let i = 0; i < record.length; ++i){
                if((Math.abs(record[i].createdAt.seconds * 1000 - new Date().getTime()) / 36e5) <= 168) {
                    if(record[i].tag === 'prelievo'){
                        recordDataSpese.push(record[i]);
                    } else{
                        recordDataEntrate.push(record[i])
                    }
                }
            }
        }
        if(thirtyDayVisible){
            for(let i = 0; i < record.length; ++i){
                var date = new Date(record[i].createdAt.seconds * 1000);
                let year = date.getFullYear()
                let month = date.getMonth();
                if((Math.abs(date - new Date().getTime()) / 36e5) <= (getDaysInMonth(month, year) * 24) ){
                    if(record[i].tag === 'prelievo'){
                        recordDataSpese.push(record[i]);
                    } else{
                        recordDataEntrate.push(record[i])
                    }
                }
            }
        }
        if(oneYearVisible){
            for(let i = 0; i < record.length; ++i){
                var date = new Date(record[i].createdAt.seconds * 1000);
                let year = date.getFullYear();
                if((Math.abs(date - new Date().getTime()) / 36e5) <= (getDaysInYear(year) * 24) ){
                    if(record[i].tag === 'prelievo'){
                        recordDataSpese.push(record[i]);
                    } else{
                        recordDataEntrate.push(record[i])
                    }
                }
            }
        }
        if(allVisible){
            for(let i = 0; i < record.length; ++i){
                if(record[i].tag === 'prelievo'){
                    recordDataSpese.push(record[i]);
                }else {recordDataEntrate.push(record[i])}
            }
        }
        return(
            <SwipeListView
            style = {{marginTop: 10}}
            data = {spese? returnData(recordDataSpese): returnData(recordDataEntrate)}
            renderItem = {renderItem}
            renderHiddenItem = {renderHiddenItem}
            leftOpenValue = {150}
            rightOpenValue = {-149}
            disableRightSwipe
        />
        )
    }
    return(
        <View style = {{flex: 1, backgroundColor: '#F9FAF4'}}>
            <View style = {{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 9,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }}>
                <View style = {{backgroundColor: '#639F86', height: 65, justifyContent: 'center'}}>
                    <View style = {{flexDirection: 'row'}}>
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
                        <Text style = {{paddingLeft: width * 0.07, color: '#fff', fontWeight: 'bold', fontSize: 19}}>
                            Pagina record
                        </Text>
                    </View>
                </View>
                <View style = {styles.recordMenu}>
                    <TouchableOpacity style = {styles.recordMenuButtons} onPress = {() => {setSpese(false)}}>
                        <Text style = 
                            {[styles.recordMenuText, 
                            {color: spese? '#A9A9A9' : 'white', borderBottomWidth: spese? 0 : 2.5, borderBottomColor: '#fff'}]}>
                            ENTRATE
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.recordMenuButtons} onPress = {() => {setSpese(true)}}>
                        <Text style = 
                            {[styles.recordMenuText,
                            {color: spese? 'white' : '#A9A9A9', borderBottomWidth: spese? 2.5 : 0, borderBottomColor: '#fff'}]}>
                            USCITE
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
                {dataListView()}
            <View style = {{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    height: 60,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 6,
                    },
                    shadowOpacity: 0.4,
                    shadowRadius: 7.4,

                    elevation: 10,
                  }}
                  >
                <TouchableOpacity
                    onPress = {() => {setSevenDayVisible(true), setOneYearVisible(false), setThirtyDayVisible(false), setAllVisible(false)}}
                    style = {{width: 80}}
                >
                    <View style = {[styles.dateMenu, styles.sevenDay, {backgroundColor: sevenDayVisible? '#FEC12A':'white'}]}>
                        <Text style = {{fontWeight: 'bold', color: sevenDayVisible?'white' : '#767965'}}>
                            7G
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress = {() => {setThirtyDayVisible(true), setOneYearVisible(false), setSevenDayVisible(false), setAllVisible(false)}}
                    style = {{width: 80}}
                >
                    <View style = {[styles.dateMenu, styles.thirtyDay, {backgroundColor: thirtyDayVisible? '#FEC12A' : 'white'}]}>
                        <Text style = {{fontWeight: 'bold', color: thirtyDayVisible? 'white' : '#767965'}}>
                            30G
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress = {() => {setOneYearVisible(true), setThirtyDayVisible(false), setSevenDayVisible(false), setAllVisible(false)}}
                    style = {{width: 80}}
                >
                    <View style = {[styles.dateMenu, styles.oneYear, {backgroundColor: oneYearVisible? '#FEC12A':'white'}]}>
                        <Text style = {{fontWeight: 'bold', color: oneYearVisible? 'white' : '#767965'}}>
                            1A
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress = {() => {setAllVisible(true), setOneYearVisible(false), setThirtyDayVisible(false), setSevenDayVisible(false)}}
                    style = {{width: 80}}
                >
                    <View style = {[styles.dateMenu, styles.everything, {backgroundColor: allVisible? '#FEC12A':'white'}]}>
                        <Text style = {{fontWeight: 'bold', color: allVisible? 'white' : '#767965'}}>
                            TUTTI
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Snackbar
            style = {{elevation: 10}}
                visible = {snackBarVisible}
                onDismiss = {() => setSnackBarVisible(false)}
                duration = {1000}
            >
                Transazione modificata con successo!
            </Snackbar>
            {getModalEdit()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
        position: "absolute",
        bottom: 0,
        width,
        height: 550,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#F9FAF4"
    },
    rowFront: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 60,
        margin: 5,
        marginBottom: height * 0.012,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4
    },
    rowFrontVisible: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 60,
        padding: height * 0.01,
    },
    rowBack: {
        flex: 1,
        flexDirection: 'row',
        margin: 5,
        borderRadius: 5
    },
    backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        height: 60,
    },
    backRightBtnLeft: {
        backgroundColor: '#1f65ff',
        right: 74,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        paddingRight: 18
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        paddingRight: 18
    },
    trash: {
        height: 30,
        width: 25,
        marginRight: 7
    },
    date: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666',
        textAlign: 'right'
    },
    dateMenu: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'
    },
    sevenDay:{
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10 ,
        borderWidth: 1.5,
        borderColor: '#FEC12A'
    },
    thirtyDay: {
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: '#FEC12A'
    },
    oneYear:{
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: '#FEC12A'
    },
    everything: {
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1.5,
        borderColor: '#FEC12A'
    },
    recordMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#639F86',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        height: 40
    },
    recordMenuButtons: {
        flex: 1,
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'
    },
    recordMenuText: {
        fontSize: 14,
        fontWeight: 'bold',
        borderBottomWidth: 3,
        borderBottomColor: '#fff'
    }
});

export default RecordScreen;