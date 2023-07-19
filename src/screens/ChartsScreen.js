import React, {useState, useEffect} from "react";
import {View, Text, Dimensions, ScrollView} from "react-native";
import {LineChart, BarChart} from "react-native-chart-kit";
import {firebase} from '../firebase/config';
import { Rect, Text as TextSVG, Svg } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function ChartsScreen(props) {
    const [record, setRecord] = useState([]);
    let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })

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

    const chartConfig = {
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(88, 88, 88, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.7,
        useShadowColorFromDataset: false,
        fillShadowGradient: 'black',
        fillShadowGradientOpacity: 1,
    };

    const speseCategoria = () => {
        let sumCibo = 0;
        let sumTrasporti = 0;
        let sumViaggi = 0;
        let sumCasa = 0;
        let sumTecnologia = 0;
        let sumExtra = 0;

        for(let transazione of record){
            if(transazione.tag === "prelievo"){
                if(transazione.category === "Cibo"){
                    sumCibo += transazione.value;
                }
                if(transazione.category === "Trasporti"){
                    sumTrasporti += transazione.value;
                }
                if(transazione.category === "Viaggi"){
                    sumViaggi += transazione.value;
                }
                if(transazione.category === "Casa"){
                    sumCasa += transazione.value;
                }
                if(transazione.category === "Tecnologia"){
                    sumTecnologia += transazione.value;
                }
                if(transazione.category === "Extra"){
                    sumExtra += transazione.value;
                }
            }
        }

        return [sumCibo, sumTrasporti, sumViaggi, sumCasa, sumTecnologia, sumExtra];
    }

    const [sumCibo, sumTrasporti, sumViaggi, sumCasa, sumTecnologia, sumExtra] = speseCategoria();

    const data = {
    labels: ["Cibo", "Trasporti", "Viaggi", "Casa", "Tecnologia", "Extra"],
    datasets: [
        {
        data: [sumCibo, sumTrasporti, sumViaggi, sumCasa, sumTecnologia, sumExtra]
        }
    ]
    };

    const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
        "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
    ];

    const getDateAndValue = () => {
        const nMonth = 6;
        let monthsArray = [];
        for (let i = 0; i < nMonth; i++) {
            var first1 = new Date();
            var first = new Date(Date.UTC(first1.getFullYear(), first1.getMonth(), first1.getDate(), 0, 0, 0, 0))
            if(i == 0 || i == 1){
                var m = first.getMonth();
            } else {
                var m = first.getMonth() - i + 1;
            }
            first.setMonth(first.getMonth() - i);
            if(i > 0 && first.getMonth() === m){
                first.setDate(0);
            }
            const firstDay = new Date(Date.UTC(first.getFullYear(), first.getMonth(), 1, 0, 0, 0, 0));
            const lastDay = new Date(Date.UTC(first.getFullYear(), first.getMonth() + 1, 0, 23, 59, 59, 999));
            monthsArray.push({
                date: first,
                sum: 0,
                ms: firstDay.getTime(),
                ms2: lastDay.getTime(),
            })
        }
        for(let transazione of record){
            if(transazione.createdAt.seconds * 1000 < monthsArray[monthsArray.length - 1].ms){
                if(transazione.tag === "ricarica"){
                    monthsArray[monthsArray.length - 1].sum += transazione.value;
                }else{
                    monthsArray[monthsArray.length - 1].sum -= transazione.value;
                }
            }
            
        }
        for(let transazione of record){
            for (let i = 0; i < nMonth; i++) {
                if(transazione.createdAt.seconds * 1000 >= monthsArray[i].ms && transazione.createdAt.seconds * 1000 <= monthsArray[i].ms2){
                    if(transazione.tag === "ricarica"){
                        monthsArray[i].sum += transazione.value;
                    }else{
                        monthsArray[i].sum -= transazione.value;
                    }
                }
            }
        }
        for (let i = 0; i < nMonth - 1; i++) {
            monthsArray[nMonth - i - 2].sum += monthsArray[nMonth - i - 1].sum
        }
        return monthsArray;
    }
    return(
        <ScrollView style = {{backgroundColor: "#F9FAF4"}}>
            <View style = {{alignItems: 'center', backgroundColor: "#F9FAF4", marginBottom: 20}}>
                <View style = {{
                                backgroundColor: '#fff',
                                marginTop: 20,
                                borderRadius: 16,
                                alignItems: 'center',
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
                    <Text style = {{marginTop: height * 0.01, marginBottom: height * 0.015, fontSize: 20, color: '#585858'}}>Andamento saldo</Text>
                    <LineChart
                        data={{
                            labels: [
                                    monthNames[getDateAndValue()[5].date.getMonth()],
                                    monthNames[getDateAndValue()[4].date.getMonth()],
                                    monthNames[getDateAndValue()[3].date.getMonth()],
                                    monthNames[getDateAndValue()[2].date.getMonth()],
                                    monthNames[getDateAndValue()[1].date.getMonth()],
                                    monthNames[getDateAndValue()[0].date.getMonth()]
                                ],
                            datasets: [
                                {
                                data: [
                                        parseFloat(getDateAndValue()[5].sum.toFixed(1)),
                                        parseFloat(getDateAndValue()[4].sum.toFixed(1)),
                                        parseFloat(getDateAndValue()[3].sum.toFixed(1)),
                                        parseFloat(getDateAndValue()[2].sum.toFixed(1)),
                                        parseFloat(getDateAndValue()[1].sum.toFixed(1)),
                                        parseFloat(getDateAndValue()[0].sum.toFixed(1))
                                    ]
                                }
                            ]
                        }}
                        width={width * 0.9}
                        height={270}
                        yAxisSuffix="€"
                        yLabelsOffset= {15}
                        yAxisInterval={1}
                        chartConfig={{
                            backgroundGradientFrom: "white",
                            backgroundGradientTo: "white",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(88, 88, 88, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "4",
                                strokeWidth: "2",
                                stroke: "#639F86"
                            }
                        }}
                        bezier
                    style={{
                            borderRadius: 16,
                        }}
                        decorator={() => {
                            return tooltipPos.visible ? <View>
                                <Svg>
                                    <Rect x={tooltipPos.x - 20} 
                                        y={tooltipPos.y + 10}
                                        rx = {5}
                                        ry = {5} 
                                        width="50" 
                                        height="30"
                                        fill="gray"/>
                                        <TextSVG
                                            x={tooltipPos.x + 5}
                                            y={tooltipPos.y + 30}
                                            fill="white"
                                            fontSize="16"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            >
                                            {tooltipPos.value}
                                        </TextSVG>
                                </Svg>
                            </View> : null
                        }}
                        onDataPointClick={(data) => {
                            let isSamePoint = (tooltipPos.x === data.x 
                                                && tooltipPos.y === data.y)
                            isSamePoint ? setTooltipPos((previousState) => {
                                return { 
                                        ...previousState,
                                        value: data.value,
                                        visible: !previousState.visible
                                    }
                            })
                            : 
                            setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });
                        }}
                    />
                </View>
                <View style = {{
                            backgroundColor: '#fff',
                            marginTop: 20,
                            alignItems: 'center',
                            borderRadius: 16,
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
                    <Text style = {{marginTop: height * 0.01, marginBottom: height * 0.015, fontSize: 20, color: '#585858'}}>Spese per categoria</Text>
                    <BarChart
                        data={data}
                        width={width * 0.9}
                        height={270}
                        yAxisSuffix="€"
                        chartConfig={chartConfig}
                        showValuesOnTopOfBars = {true}
                        style = {{
                            borderRadius: 16,
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    )
}