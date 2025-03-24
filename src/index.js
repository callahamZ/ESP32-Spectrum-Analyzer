import { Chart, Colors } from 'chart.js/auto'
import { rgb } from 'd3'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyADIx4Bxv0SO8nUIAzv-1n53oYEFi1h14I",
    authDomain: "esp32-light-spectrum-analyzer.firebaseapp.com",
    databaseURL: "https://esp32-light-spectrum-analyzer-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esp32-light-spectrum-analyzer",
    storageBucket: "esp32-light-spectrum-analyzer.appspot.com",
    messagingSenderId: "1016576536089",
    appId: "1:1016576536089:web:a1334d1537a22e9de4c488"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const spektrumData = ref(database, "sensorSpektrum")
const tempSensor = ref(database, "sensorSuhu")
const lightSensor = ref(database, "sensorCahaya")
const infoData = ref(database, "Informasi")

let spektrumDataArr = [];
let sumbuX = ["350nm", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "750nm"];
let processHolder = 1;

onValue(infoData, (snapshot) => {
    const infoConnection = snapshot.val()
    let ssid = infoConnection.SSID
    let ipAddr = infoConnection.IP

    let ssidText = document.getElementById("ssid")
    let ipAddrText = document.getElementById("ipAddr")

    ssidText.innerText = "SSID : " + ssid
    ipAddrText.innerText = "IP Address : " + ipAddr
})

onValue(spektrumData, (snapshot) => {
    const colorData = snapshot.val()
    // console.log(colorData)

    spektrumDataArr = [
        0,
        colorData.F1,
        colorData.F2,
        colorData.F3,
        colorData.F4,
        colorData.F5,
        colorData.F6,
        colorData.F7,
        colorData.F8,
        0
    ]

    spektrumChart.data.datasets[0].data = spektrumDataArr.map(value => parseFloat(value) || 0); // Update the chart data
    spektrumChart.update();

    let redVal = document.getElementById('redVal')
    let greenVal = document.getElementById('greenVal')
    let blueVal = document.getElementById('blueVal')

    redVal.innerText = colorData.Red
    greenVal.innerText = colorData.Green
    blueVal.innerText = colorData.Blue
})

onValue(tempSensor, (snapshot) => {
    const tempData = snapshot.val()
    let suhuCelcius = tempData.Suhu

    let suhuFahrenheit = suhuCelcius * 1.8 + 32
    let suhuReamur = suhuCelcius * 0.8

    let celcius = document.getElementById('celcius')
    let fahrenheit = document.getElementById('fahrenheit')
    let reamur = document.getElementById('reamur')

    celcius.innerText = suhuCelcius + "° C"
    fahrenheit.innerText = suhuFahrenheit.toFixed(2) + "° F"
    reamur.innerText = suhuReamur.toFixed(2) + "° R"
})

onValue(lightSensor, (snapshot) => {
    const luxData = snapshot.val()
    let lux = luxData.Lux

    let luxText = document.getElementById('luxText')
    luxText.innerText = lux + " Lux"
})

const spektrumChart = new Chart(
    document.getElementById('Chart1'),
    {
        type: 'line',
        data: {
            labels: sumbuX,
            datasets: [
            {
                label: 'Red',
                data: spektrumDataArr.map(value => parseFloat(value) || 0),
                borderColor: 'rgba(0, 0, 0)',
                tension: 0.4,
                fill: true,
                backgroundColor: context => {
                    const chart = context.chart;
                    const { ctx, chartArea, scales } = chart;
                
                    if (!chartArea) {
                        return null;
                    }
                
                    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                    gradient.addColorStop(0, 'rgb(111, 47, 159)');
                    gradient.addColorStop(0.14285714285714285, 'rgb(0, 31, 95)');
                    gradient.addColorStop(0.2857142857142857, 'rgb(63, 146, 207)');
                    gradient.addColorStop(0.42857142857142855, 'rgb(0, 175, 239)');
                    gradient.addColorStop(0.5714285714285714, 'rgb(0, 175, 80)');
                    gradient.addColorStop(0.7142857142857143, 'rgb(255, 255, 0)');
                    gradient.addColorStop(0.8571428571428571, 'rgb(247, 149, 70)');
                    gradient.addColorStop(1, 'rgb(255, 0, 0)');
                
                    return gradient;
                }
            }
            ]
            
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 1000
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    }
)
