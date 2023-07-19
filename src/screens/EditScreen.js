import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Dimensions, StyleSheet, Image, ScrollView, Alert} from 'react-native';
import {firebase} from '../firebase/config';
import {TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { icons } from '../../constants';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get("window");

const _format = 'YYYY-MM-DD';
const _today = moment().format(_format);

export default function EditScreen (props){

    const userID = props.userID;
    const prelievoRef = firebase.firestore().collection('users').doc(userID).collection('transitions');
    const numberValue = props.objectData.value;

    const tag = () => {
        if(props.objectData.tag === "prelievo"){
            return true;
        }
        return false;
    }

    let currencyArray = [
        {
            currency: 'EUR',
            currencySymbol: '€',
            index: 0
        },
        {
            currency: 'USD',
            currencySymbol: '$',
            index: 1
        },
        {
            currency: 'GBP',
            currencySymbol: '£',
            index: 2
        },
        
    ]

    const [loading, setLoading] = useState(false);
    //logica ricarica/prelievo
    const [prelievo, setPrelievo] = useState(tag());
    const [categoria, setCategoria] = useState(props.objectData.category);
    const [moneyValue, setMoneyValue] = useState(numberValue.toFixed(1));
    const [descrizione, setDescrizione] = useState(props.objectData.description);
    const [currency, setCurrency] = useState(currencyArray[0]);

    //errori nelle transazioni
    const [errorValue, setErrorValue] = useState(false);

    // visibilita modal menu/calendario
    const [modalMenuVisible, setModalMenuVisible] = useState(false);
    const [modalCalendarVisible, setModalCalendarVisible] = useState(false);

    //calendario
    const [dateString, setDateString] = useState(props.objectData.date);
    const [calendar, setCalendar] = useState({});

    //rende selezionabile la data nel calendario
    function onDayPress (day) {
        setCalendar({selected: day.dateString});
    }

    let moneyValueFloat = parseFloat(moneyValue);

    const apiCall = async () =>{
        try{
            const currencyValue = currency.currency + '_EUR';
            const dateValue = dateString.split("/").reverse().join("-");
            setLoading(true);
            let response = await fetch('https://free.currconv.com/api/v7/convert?q=' + currencyValue + '&compact=ultra&date=' + dateValue + '&apiKey=8e88cf2b370bd3d4f3ff')
            let value = await response.json();
            setLoading(false);
            moneyValueFloat = parseFloat(value[currencyValue][dateValue]) * moneyValueFloat;
            } catch(error){
                alert(error);
                setLoading(false);
            }
        }

    const handleClick = () => {
        let i = currency.index < currencyArray.length - 1 ? currency.index += 1 : currency.index = 0;
        setCurrency(currencyArray[i]);
    }
    
    //Converte la data in formato italiano
    function convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat)
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
    }

    //Controlla se il valore della transazione e' scritto in formato corretto
    const valueRegexp = (value) => {
        const re = /^\d*\.?\d*$/
        return re.test(String(value));
    }

    //renderizza il menu per la scelta delle categorie
    const renderModalMenu = () => {
        return(
            <Modal
            animationIn = 'fadeIn'
            animationOut = 'fadeOut'
            isVisible={modalMenuVisible}
            hasBackdrop={true}
            backdropOpacity={0.5}
            backdropColor={'rgba(0, 0, 0, 0.8)'}
            backdropTransitionInTiming = {0}
            backdropTransitionOutTiming = {0}
            onBackdropPress={() => {
            setModalMenuVisible(false);
            }}
            >
                <View style = {{backgroundColor: 'white', borderRadius: 10}}>
                <TouchableOpacity
                        onPress = {() => {setCategoria('Cibo'), setModalMenuVisible(false)}}
                    >
                        <View style = {{flexDirection: 'row', padding: 10}}>
                            <FastImage  
                                source = {icons.cibo}
                                style = {{width: width * 0.08, height: height * 0.04}}/>
                            <Text style = {{paddingLeft: 5, fontSize: width * 0.04}}>
                                Cibo
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => {setCategoria('Trasporti'), setModalMenuVisible(false)}}
                    >
                        <View style = {{flexDirection: 'row', padding: 10}}>
                            <FastImage  
                                source = {icons.trasporti}
                                style = {{width: width * 0.08, height: height * 0.04}}/>
                            <Text style = {{paddingLeft: 5, fontSize: width * 0.04}}>
                                Trasporti
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => {setCategoria('Viaggi'), setModalMenuVisible(false)}}
                    >
                        <View style = {{flexDirection: 'row', padding: 10}}>
                            <FastImage  
                                source = {icons.viaggi}
                                style = {{width: width * 0.08, height: height * 0.04}}/>
                            <Text style = {{paddingLeft: 5, fontSize: width * 0.04}}>
                                Viaggi
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => {setCategoria('Casa', setModalMenuVisible(false))}}
                    >
                        <View style = {{flexDirection: 'row', padding: 10}}>
                            <FastImage  
                                source = {icons.casa}
                                style = {{width: width * 0.08, height: height * 0.04}}/>
                            <Text style = {{paddingLeft: 5, fontSize: width * 0.04}}>
                                Casa
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => {setCategoria('Tecnologia'), setModalMenuVisible(false)}}
                    >
                        <View style = {{flexDirection: 'row', padding: 10}}>
                            <FastImage  
                                source = {icons.tecnologia}
                                style = {{width: width * 0.08, height: height * 0.04}}/>
                            <Text style = {{paddingLeft: 5, fontSize: width * 0.04}}>
                                Tecnologia
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => {setCategoria('Extra'), setModalMenuVisible(false)}}
                    >
                        <View style = {{flexDirection: 'row', padding: 10}}>
                            <FastImage  
                                source = {icons.extra}
                                style = {{width: width * 0.08, height: height * 0.04}}/>
                            <Text style = {{paddingLeft: 5, fontSize: width * 0.04}}>
                                Extra
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    //renderizza il calendario
    const renderModalCalendar = () => {
        return(
            <Modal
              animationIn = 'fadeIn'
              animationOut = 'fadeOut'
              isVisible={modalCalendarVisible}
              hasBackdrop={true}
              backdropOpacity={0.5}
              backdropColor={'rgba(0, 0, 0, 0.8)'}
              backdropTransitionInTiming = {0}
              backdropTransitionOutTiming = {0}
              onBackdropPress={() => {
                setModalCalendarVisible(false);
              }}
            >
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style = {{borderRadius: 10, backgroundColor: 'white', width: width * 0.85, justifyContent: 'center'}}>
                  <Text style = {{fontSize: height * 0.03, paddingTop: 10, textAlign: 'left', paddingLeft: 15}}>
                    Seleziona data
                  </Text>
                  <View style = {{alignItems: 'center'}}>
                    {showCalendar()}
                  </View>
                  <Text>
                    {''}
                  </Text>
                </View>
              </View>
            </Modal>
        )
    }

    //logica per funzionamento calendario
    const showCalendar = () => {
        return(
            <View style = {{width: '90%'}}>
                <Calendar
                  onDayPress = {(day) => {onDayPress(day); setDateString(convertDate(day.dateString)); setTimeout(function(){setModalCalendarVisible(false)}, 300)}}
                  hideExtraDays
                  markedDates = {{
                    [calendar.selected]: {
                      selected: true,
                      disableTouchEvent: true
                    }
                  }}
                  maxDate = {_today}
                />
            </View>
        )
    }
    
    //controlla se i dati inseriti sono validi
    const checkDati = () => {
        if(!moneyValue.trim() || moneyValueFloat < 0 || !valueRegexp(moneyValue)){
            setErrorValue(true)
            return false;
        }
        if(categoria === "Entrate" && prelievo){
            Alert.alert("Dati errati", "Inserisci la categoria");
            return false;
        }
        return true;
    };

    //gestione timestamp
    const timeFunct = () => {
        var today = new Date();
        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        var newDate = dateString;
        var newDateParts = newDate.split("/");
        var newDateObject = new Date(+newDateParts[2], newDateParts[1] - 1, +newDateParts[0]);
        let timeStamp = firebase.firestore.Timestamp.fromDate(newDateObject);
        if(myToday.valueOf() ===  newDateObject.valueOf()){
            timeStamp = firebase.firestore.Timestamp.now();
        }
        return timeStamp;
    }

    //carica sul database le informazioni relative al prelievo
    const addTextTransazione = () =>{
        let data = {};
        if(prelievo){
            data = {
                authorID: userID,
                value: parseFloat((Math.round(moneyValueFloat * 100) / 100).toFixed(1)),
                createdAt: timeFunct(),
                date: dateString,
                category: categoria,
                tag: 'prelievo',
                description: descrizione
            };
        }
        else{
            data = {
                authorID: userID,
                value: parseFloat((Math.round(moneyValueFloat * 100) / 100).toFixed(1)),
                createdAt: timeFunct(),
                date: dateString,
                category: categoria,
                tag: 'ricarica',
                description: descrizione
            };
        }
        prelievoRef
        .doc(props.objectData.id)
        .update(data)
        .catch((error) => {
            alert(error)
        })
    }

    //controlli e modifiche basate su prelievo/ricarica
    const checkButton = async () => {
        if(!checkDati()){
            return;
        }
        if(currency.currency !== 'EUR'){
            await apiCall();
        };
        
        addTextTransazione();
        props.closeModalEdit();
        props.showSnackBar();
        return;
    }

    const source = props.iconsMap().get(categoria);

    return(
        <ScrollView>
            <View style = {{
                backgroundColor: '#639F86',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 35,
                borderBottomRightRadius: 35,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.39,
                shadowRadius: 8.30,

                elevation: 13,
            }}
            >
                <Text style = {{paddingTop: 15, paddingBottom: 15, fontSize: 19, textAlign: 'center', color: '#fff'}}> 
                    Aggiungi Transazione
                </Text>
                <View style = {styles.recordMenu}>
                    <TouchableOpacity 
                        style = {styles.recordMenuButtons}
                        onPress = {() => {setPrelievo(false); setCategoria('Entrate')}}
                    >
                        <Text style = {[
                                styles.recordMenuText, 
                                {color: prelievo? '#A9A9A9' : 'white', borderBottomWidth: prelievo? 0 : 2.5, borderBottomColor: '#fff'
                            }]}
                        >
                            ENTRATE
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style = {styles.recordMenuButtons}
                        onPress = {() => setPrelievo(true)}
                    >
                        <Text style = {[
                                styles.recordMenuText,
                                {color: prelievo? 'white' : '#A9A9A9', borderBottomWidth: prelievo? 2.5 : 0, borderBottomColor: '#fff'}
                            ]}
                        >
                            SPESA
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* */}
            <View style = {{flexDirection: 'row', paddingTop: 10, justifyContent: 'center'}}>
                <View style = {{alignItems: 'center'}}>
                    <TextInput
                        style = {{
                            width: width * 0.4,
                            backgroundColor: '#F9FAF4',
                            height: 30,
                            paddingTop: 10,
                            fontSize: 27
                        }}
                        placeholder = "0.00"
                        keyboardType = "number-pad"
                        theme = {{colors: {text: 'black', primary: 'green'}}}
                        underlineColor='gray'
                        error = {errorValue}
                        onChangeText = {(value) => {setMoneyValue(value), setErrorValue(false)}}
                        value = {moneyValue}
                    >
                    </TextInput>
                    {errorValue ? (
                        <>
                            <Text style = {{color: 'red'}}> Dati inseriti non validi </Text>
                        </>
                        ) : (
                        <>
                            <Text></Text>
                        </>
                        )
                    }
                </View>
                <TouchableOpacity
                    onPress = {() => handleClick()}
                >
                    <View style = {styles.eur}>
                        <Text style = {{fontSize: 30}}>
                            {currency.currencySymbol}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

                {/* Menu */}

                <View style = {{ padding : height * 0.007, paddingLeft: width * 0.03}}>
                    <Text style = {{fontSize: 15, color: '#696969'}}>
                        Categoria
                    </Text>
                </View>
                <View style = {{marginLeft: 10, borderWidth: 1.5, borderRadius: 10, width: width * 0.6, borderColor:'black'}}>
                        {prelievo? (
                            <TouchableOpacity
                                onPress = {() => setModalMenuVisible(true)}
                                activeOpacity = {.7}
                                style = {{width: width * 0.6}}
                            >
                            {categoria === "Entrate" ? (
                                    <>
                                        <View style = {{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style = {{fontSize: 14, color: 'grey',  paddingLeft: 10, paddingBottom: 18, paddingTop: 18}}>
                                                CATEGORIA 
                                            </Text>
                                            <Text style = {{paddingRight: 16}}>
                                                    ▼
                                            </Text>
                                        </View>
                                    </>
                                )   :   (
                                    <> 
                                        <View style = {{paddingLeft: 10, paddingBottom: 9, paddingTop: 9, flexDirection: 'row', alignItems: 'center'}}>
                                            <FastImage 
                                                source = {source}
                                                style = {{
                                                    width: 35,
                                                    height: 40,
                                                    resizeMode: 'contain',
                                                }}
                                                />
                                                <Text style = {{fontSize: 17, fontWeight: 'bold', paddingLeft: 15, flex: 1}}>
                                                    {categoria}
                                                </Text>
                                                <Text style = {{paddingRight: 16, textAlign: 'right'}}>
                                                    ▼
                                                </Text>
                                        </View>
                                    </>
                                        )}
                            </TouchableOpacity>
                            ) : (
                                <View style = {{paddingLeft: 10, paddingBottom: 9, paddingTop: 9, flexDirection: 'row', alignItems: 'center'}}>
                                    <FastImage 
                                        source = {props.iconsMap().get("Entrate")}
                                        style = {{
                                            width: 35,
                                            height: 40,
                                            resizeMode: 'contain',
                                        }}
                                        />
                                    <Text style = {{fontSize: 17, fontWeight: 'bold', paddingLeft: 15}}>
                                        Entrate
                                    </Text>
                                </View>
                            )}
                    {renderModalMenu()}
                </View>

                {/* Calendario */}

                <TouchableOpacity
                    onPress = {() => setModalCalendarVisible(true)}
                    activeOpacity = {.7}
                    style = {{width: width * 0.6}}
                >
                    <View style = {{ padding : height * 0.007, paddingLeft: width * 0.03}}>
                        <Text style = {{fontSize: 15, color: '#696969'}}>
                            Calendario
                        </Text>
                    </View>
                    <View style = {{ marginLeft: 10, borderWidth: 1.5, borderRadius: 10, width: width * 0.6, borderColor:'black'}}>
                        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10}}>
                            <Text style = {{fontSize: 14, color: 'grey',  paddingLeft: 10, paddingBottom: 18, paddingTop: 18}}>
                                DATA
                            </Text>
                            <View style = {{flexDirection: 'row-reverse', alignItems: 'center'}}>
                                <FastImage 
                                    source = {icons.calendar}
                                    style = {{height: 25, width: 25}}
                                />
                                <Text style = {{fontSize: 14, fontWeight: 'bold'}}>{dateString}</Text> 
                            </View>
                            {renderModalCalendar()}
                        </View>
                    </View>
                </TouchableOpacity> 
                <View style = {{ padding : height * 0.007, paddingLeft: width * 0.03}}>
                <Text style = {{fontSize: 15, color: '#696969'}}>   
                        Descrizione
                </Text>
            </View>
            <View>
                <TextInput
                    style = {{
                        width: width * 0.6 ,
                        backgroundColor: '#F9FAF4',
                        height: 30,
                        marginLeft: 10,
                        fontSize: 16
                    }}
                    theme = {{colors: {text: 'black', primary: 'black'}}}
                    placeholder = "Descrizione"
                    onChangeText = {(descrizione) => {setDescrizione(descrizione)}}
                    value = {descrizione}
                    maxLength = {26}
                >
                </TextInput>
            </View>
            <View style = {{paddingTop: 30, alignItems: 'center'}}>
                <TouchableOpacity style = {styles.save} onPress = {() => checkButton()}>
                    <Text style = {{
                            fontSize: 19,
                            fontWeight: 'bold',
                            color: 'white',}}
                    >
                        Salva
                    </Text>
                </TouchableOpacity>
            </View>
            <Spinner 
                visible = {loading}
                //textContent = {'Aspetta...'}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    plus: {
        width: width * 0.08,
        height: height * 0.05,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    eur: {
        width: 50,
        height: 50,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    save: {
        backgroundColor: '#FEC12A',
        width: width * 0.6,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    recordMenuButtons: {
        flex: 1,
        alignItems: 'center',
        height: height * 0.06,
        justifyContent: 'center'
    },
    recordMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#639F86',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        height: 40
    },
    
    recordMenuText: {
        fontSize: 14,
        fontWeight: 'bold',
        borderBottomWidth: 3,
        borderBottomColor: '#fff'
    }
})
