import { Chart } from 'chart.js/auto'
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

let colorArr = [];
let processHolder = 1;

onValue(spektrumData, (snapshot) => {
    if (processHolder != 3) {
        processHolder++
        return
    }

    if (processHolder == 3) {
        processHolder = 1
    }

    const colorData = snapshot.val()
    console.log(colorData)

    if (colorArr.length == 10) {
        colorArr.shift()

        spektrumChart.data.datasets[0].data.shift()
        spektrumChart.data.datasets[1].data.shift()
        spektrumChart.data.datasets[2].data.shift()
    }

    colorArr.push(colorData)

    console.log(colorArr)

    spektrumChart.data.datasets[0].data.push(colorData.Red)
    spektrumChart.data.datasets[1].data.push(colorData.Green)
    spektrumChart.data.datasets[2].data.push(colorData.Blue)
    spektrumChart.update("none");

    let redVal = document.getElementById('redVal')
    let greenVal = document.getElementById('greenVal')
    let blueVal = document.getElementById('blueVal')

    redVal.innerText = colorData.Red
    greenVal.innerText = colorData.Green
    blueVal.innerText = colorData.Blue
})

const spektrumChart = new Chart(
    document.getElementById('Chart1'),
    {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [
            {
                label: 'Red',
                data: colorArr.map(row => row.Red),
                borderColor: 'rgba(255, 0, 0)'
            },
            {
                label: 'Green',
                data: colorArr.map(row => row.Green),
                borderColor: 'rgba(0, 255, 0)'
            },
            {
                label: 'Blue',
                data: colorArr.map(row => row.Blue),
                borderColor: 'rgba(0, 0, 255)'
            }
            ]
            
        }
    }
)
