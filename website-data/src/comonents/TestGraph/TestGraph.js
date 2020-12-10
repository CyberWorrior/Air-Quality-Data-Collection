
import React, { useState , useEffect} from 'react'
import db from '../../firebase'
import {Line} from 'react-chartjs-2'
import "chartjs-plugin-streaming";
import ReactApexChart from 'react-apexcharts';


function TestGraph() {
  const [airData,setAirData] = useState()
  const [time,setTime] = useState([])
  const [ppm,setPPM] = useState([])
  const [soundState, setSoundState] = useState()

  
  useEffect(()=>{
    db.collection("airData").orderBy("timestamp","asc").limitToLast(70).onSnapshot(snapshot =>{
      let tempArray = []
      let tempPPM = []
      let tempTime = []
      snapshot.docs.map(snap=>{
        tempArray.push(snap.data())
        tempPPM.push(parseFloat(snap.data().airquality))
        tempTime.push(snap.data().stringtime)
      })
      setAirData(tempArray)
      setTime(tempTime)
      setPPM(tempPPM)
    })
    db.collection('soundData').orderBy("timestamp",'asc').limitToLast(1).onSnapshot(snapshot=>{
      snapshot.docs.map(snap=>{
        setSoundState(snap.data())
      })
    })
  },[])

  const datas = {
    series: [{
        name: "CO2 PPM",
        data: ppm.slice()
    }],
    seriesLine:[{
      data: ppm.slice()
    }],
    options: {
      chart: {
        height: 450,
        type: 'line',
        id:'ppmchart',
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          autoSelected: 'pan',
          show:true
        }
      },
      dataLabels: {
        enabled: true
      },
      markers: {
        size: 0
      },
      stroke: {
        curve: 'straight',
        width:3
      },
      title: {
        text: 'Air Quality Index',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: time,
        title:{
          text:'Time'
        }
      }
    },
    optionsLine:{
      chart:{
        id:'brushchart',
        height:130,
        type:'area',
        brush:{
          target:'ppmchart',
          enabled:true,
          autoScaleYaxis:true
        },
        selection:{
          enabled:true,
          xaxis:{
            min:time[0],
            max:time[time.length]
          }
        },
        colors: ['#008FFB'],
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.91,
            opacityTo: 0.1,
          }
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          tickAmount: 1000
        }
      }
    }
  
  };

  return (
      <div className="container-fluid">
        <div className="graph__main" style={{paddingTop:5,paddingLeft:0}}>
          <p>*ALL VALUES ARE UPDATED EVERY 10 MINUTES</p>
          <div className="main_chart">
            <ReactApexChart options={datas.options} series={datas.series} type="line" height={450}/>
          </div>
          <div className="sec_chart">
            <ReactApexChart options={datas.optionsLine} series={datas.seriesLine} type="area" height={130}/>
          </div>
        </div>
      </div>
  )
}

export default TestGraph
