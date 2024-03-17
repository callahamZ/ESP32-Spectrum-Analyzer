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
let timeArr = [];
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
    if (processHolder != 3) {
        processHolder++
        return
    }

    if (processHolder == 3) {
        processHolder = 1
    }

    const colorData = snapshot.val()

    if (spektrumDataArr.length == 10) {
        spektrumDataArr.shift()

        spektrumChart.data.datasets[0].data.shift()
        spektrumChart.data.datasets[1].data.shift()
        spektrumChart.data.datasets[2].data.shift()

        spektrumChart.data.labels.shift()
    }

    spektrumDataArr.push(colorData)

    spektrumChart.data.labels.push(colorData.infoWaktu)

    spektrumChart.data.datasets[0].data.push(colorData.Red)
    spektrumChart.data.datasets[1].data.push(colorData.Green)
    spektrumChart.data.datasets[2].data.push(colorData.Blue)
    spektrumChart.update("none")

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
            labels: timeArr,
            datasets: [
            {
                label: 'Red',
                data: spektrumDataArr.map(row => row.Red),
                borderColor: 'rgba(255, 0, 0)'
            },
            {
                label: 'Green',
                data: spektrumDataArr.map(row => row.Green),
                borderColor: 'rgba(0, 255, 0)'
            },
            {
                label: 'Blue',
                data: spektrumDataArr.map(row => row.Blue),
                borderColor: 'rgba(0, 0, 255)'
            }
            ]
            
        }
    }
)
