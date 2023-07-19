import React, {useState, useEffect} from 'react';
import { 
    Text,
    View,
    Dimensions, 
    StyleSheet,
    TouchableOpacity, 
    FlatList,
    ScrollView,
    LogBox
} from 'react-native';
import {firebase} from '../firebase/config';
import { FloatingAction } from 'react-native-floating-action';
import {VictoryPie} from 'victory-native';
import Modal from "react-native-modalbox";
import { TransitionScreen } from '../screens';
import { icons } from '../../constants';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Feather from 'react-native-vector-icons/Feather';
import NumberFormat from 'react-number-format';
import { Snackbar } from 'react-native-paper';

const { width, height } = Dimensions.get("window");
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function HomeScreen(props) {
    const [saldo, setSaldo] = useState(0);
    const [record, setRecord] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [sumRicarica, setSumRicarica] = useState(0);
    const [sumPrelievo, setSumPrelievo] = useState(0);
    const [snackBarVisible, setSnackBarVisible] = useState(false);

    const userID = props.extraData.id;
    const prelievoRef = firebase.firestore().collection('users').doc(userID).collection('transitions');

    //preleva dal database i dati sui prelievi e ricariche e preleva e aggiorna il saldo
    useEffect(() => {
        let isMounted = true;
        prelievoRef
        .where("authorID", "==", userID)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
            querySnapshot => {
                if(isMounted){
                const prel = []
                let sumPrelievo = 0;
                let sumRicarica = 0;
                querySnapshot.forEach(doc =>{
                    const data = doc.data()
                    data.id = doc.id
                    prel.push(data)
                });
                    for (let i = 0; i < prel.length; ++i){
                        if(prel[i].tag === "prelievo"){
                            sumPrelievo += prel[i].value;
                        } else{
                            sumRicarica += prel[i].value
                        }
                    }
                    setRecord(prel);
                    setSumPrelievo(sumPrelievo);
                    setSumRicarica(sumRicarica);
                    setSaldo(sumRicarica - sumPrelievo);
                }
            },
            error =>{
                alert(error)
            }
        )
        return () => {isMounted = false} ;
    }, []);

    //per il floating button
    const actions = [
        {
            text: "Transazioni",
            textElevation: 10,
            name: "nat_transazioni",
            icon: <Feather
                        name = "plus"
                        size = {25}
                        color = "#fff"
                    />,
            buttonSize: height * 0.05
        }
    ]

    //Metodo per chiudere la modal
     function closeModal() {
        setModalVisible(false);
    }

    //Metodo per far comparire la snackbar
    function showSnackBar() {
        setSnackBarVisible(true);
    }

    //Metodo helper per le icone per transazione
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

    //Proprieta e contenuto della modal per le transazioni
    const getModal = () => {
        return (
          <Modal
            entry="bottom"
            backButtonClose = {true}
            isOpen={modalVisible}
            style={styles.modalBox}
            onClosed={() => setModalVisible(false)}
            coverScreen = {true}
          >
            <KeyboardAwareScrollView enableOnAndroid = {true} style = {[styles.content, {flexGrow: 1}]}>
                    <TransitionScreen {...props} closeModal = {closeModal} iconsMap = {iconsMap} saldo = {saldo} showSnackBar = {showSnackBar}  />
            </KeyboardAwareScrollView>
          </Modal>
        );
      };

    const datiTransazioni = [
        { x: "entrate", y: sumRicarica },
        { x: "uscite", y: sumPrelievo },
    ];

    //SEZIONE LISTA DI RECORD

    //renderizza il contenuto di un elemento del record
    const VisibleItem = props => {
        const {data} = props;
        const source = iconsMap().get(data.item.category)
        return (
            <View style = {styles.rowFront}>
                <View
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
                </View>
            </View>
        );
    }

    //Metodo helper per la creazione grafica delle transazioni
    const renderItem = (data) => {
        return <VisibleItem data = {data}/>;
    };


    //ritorna una map che contiene i dati relativi ai prelievi e aggiunte
    const list = () => {
        return record.map((elemento) => ({
            key: elemento.id,
            value: elemento.value,
            tag: elemento.tag,
            date: elemento.date,
            category: elemento.category,
            description: elemento.description
        }));
    };

    return (
        <View
        style = {{
            flex: 1,
            alignItems: 'center',
            backgroundColor: "#F9FAF4"
        }}
        >
            <ScrollView style = {{flex: 1, width: '100%'}}>
                {/* Saldo e view saldo + grafico */}
                <View 
                    style = {{
                        alignSelf: 'center',
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: '#fff', 
                        width: "95%",
                        borderRadius: 10,
                        //paddingTop: height * 0.007,
                        marginTop: height * 0.007,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.29,
                        shadowRadius: 4.65,

                        elevation: 7,
                    }}
                >
                <View style = {{alignItems: 'flex-start', flexDirection: 'row'}}>
                    <Text style = {{color: 'black', fontSize: 40, fontWeight: 'bold'}}>
                        Saldo: {''}
                    </Text>
                    <NumberFormat 
                        value={saldo.toFixed(1)}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={'€'}
                        renderText = {formattedValue => <Text 
                                                            style = {{
                                                                color: saldo >= 0? 'green' : 'red',
                                                                fontSize: 40,
                                                                fontWeight: 'bold',
                                                                flexShrink: 1
                                                            }} 
                                                            numberOfLines = {1}
                                                        >
                                                            {formattedValue}
                                                        </Text>
                        }
                    />
                </View>
                    {/* Grafico entrate-uscite */}
                    {sumRicarica === 0 && sumPrelievo === 0? (
                        <>
                            <VictoryPie 
                                style = {{labels: {fontSize: 0.00001}}}
                                height = {170}
                                colorScale = {["#888888"]}
                                radius = {80}
                                innerRadius = {40}
                                data = {[{y: 1}]}
                            />
                            <View style = {{alignItems: 'center', paddingBottom: 10, flexDirection:'row'}}>
                                <View style = {{height: 9, width: 9, borderRadius: 5, backgroundColor: 'gray'}}></View>
                                <Text style = {{color: 'black', paddingLeft: 5, paddingRight: 10, fontSize: 14}}>
                                    entrate
                                </Text>
                                <View style = {{height: 9, width: 9, borderRadius: 5, backgroundColor: 'gray'}}></View>
                                <Text style = {{color: 'black', paddingLeft: 5, fontSize: 14}}>
                                    uscite
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <VictoryPie
                                style = {{labels: {fontSize: 0.00001}}}
                                height = {170}
                                colorScale = {["#71C349", "#EF4141"]}
                                radius = {80}
                                innerRadius = {40}
                                animate = {{duration : 2000}}
                                data = {datiTransazioni}
                            />
                            <View style = {{alignItems: 'center', paddingBottom: 10, flexDirection: 'row'}}>
                                <View style = {{height: 9, width: 9, borderRadius: 5, backgroundColor: '#71C349'}}></View>
                                <Text style = {{paddingLeft: 5, color: 'black'}}>
                                    entrate: {''}
                                </Text>
                                <NumberFormat 
                                    value={sumRicarica}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'€'}
                                    renderText = {formattedValue => <Text 
                                                                        style = {{
                                                                            fontSize: 14,
                                                                            flexShrink: 1,
                                                                            paddingRight: 10
                                                                            
                                                                        }} 
                                                                        numberOfLines = {1}
                                                                    >
                                                                        {formattedValue}
                                                                    </Text>
                                    }
                                />
                                <View style = {{height: 9, width: 9, borderRadius: 5, backgroundColor: '#EF4141'}}></View>
                                <Text style = {{color: 'black', paddingLeft: 5}}>
                                    uscite: {''}
                                </Text>
                                <NumberFormat 
                                    value={sumPrelievo}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'€'}
                                    renderText = {formattedValue => <Text 
                                                                        style = {{
                                                                            fontSize: 14,
                                                                            flexShrink: 1,
                                                                            paddingRight: 10
                                                                            
                                                                        }} 
                                                                        numberOfLines = {1}
                                                                    >
                                                                        {formattedValue}
                                                                    </Text>
                                    }
                                />
                            </View>
                        </>
                    )}
                </View>
                {/* Lista di transazioni */}
                <View
                    style = {{
                        width: "95%",
                        alignSelf: 'center',
                        borderRadius: 10,
                        marginBottom: 40,
                        backgroundColor: '#fff',
                        marginTop: height * 0.01,
                        flexGrow: 0,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.29,
                        shadowRadius: 4.65,

                        elevation: 7,
                    }}
                >   
                    <View style = {{margin: height * 0.01}}>
                        <Text style = {{fontSize: 24, fontWeight: 'bold'}}>
                            ULTIME TRANSAZIONI
                        </Text>
                    </View>
                    <FlatList
                        data = {list().slice(0, 4)}
                        renderItem = {renderItem}
                        keyExtractor = {item => item.key}
                        scrollEnabled = {false}
                    />
                    <View style = {{paddingLeft: 10, paddingBottom: 15, width: 112}}>
                        {record.length === 0 ? (
                        <TouchableOpacity onPress = {() => setModalVisible(true)}>
                            <Text style = {{fontSize: 14, fontWeight: 'bold', color: 'blue'}}>
                                AGGIUNGI TRANSAZIONE
                            </Text>
                        </TouchableOpacity>
                        ) : (
                        <TouchableOpacity
                            onPress = {() => props.navigation.navigate('Record')}
                        >
                            <Text style = {{fontSize: 14, fontWeight: 'bold', color: 'blue'}}>
                                MOSTRA DI PIÚ
                            </Text>
                        </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Notifica snackBar per transazione creata */}
                {getModal()}
            </ScrollView>
            {/* Floating button */}
            <FloatingAction
                actions = {actions}
                color = '#FEC12A'
                buttonSize = {60}
                distanceToEdge = {{vertical: width * 0.03, horizontal: width * 0.03}}
                overrideWithAction = {true}
                onPressItem = {name =>{
                    if(name === "nat_transazioni"){
                        setModalVisible(true)
                    }
                }}
            />
            <Snackbar
                style = {{
                    elevation: 8
                }}
                visible = {snackBarVisible}
                onDismiss = {() => setSnackBarVisible(false)}
                duration = {1000}
            >
                Transazione creata con successo!
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    modalBox: {
        position: "absolute",
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
    date: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666',
        textAlign: 'right'
    },
});