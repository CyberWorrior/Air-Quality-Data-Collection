// import React,{useEffect,useState} from 'react'
// import db from '../../firebase';
// import ReactApexChart from 'react-apexcharts'
// import {Line} from 'react-chartjs-2'
// import "chartjs-plugin-streaming";
// import Linegraph from '../Linegraph/Linegraph';
// // var createReactClass = require("create-react-class");
// // const [airData,setAirData] = useState([]); 
// //     const [ppmValue,setPpmValue] = useState([]);
// //     const [timeValue,setTimeValue] = useState([]);


//     // useEffect(()=>{
//     //     const interval = setInterval(()=>{
//     //         db.collection("airData")
//     //             .orderBy("timestamp", "desc").limit(8).onSnapshot(snapshot=>{
//     //         let newArray = snapshot.docs.map(doc=>({
//     //             id:doc.id,
//     //             data:doc.data()
//     //         }))
//     //         setAirData(airData.concat(newArray))   
//     //         console.log(airData)
//     //         airData.forEach((each)=>{
//     //           setPpmValue(ppmValue.concat(each.data.airquality))
//     //           setTimeValue(timeValue.concat(each.data.stringtime))
//     //         }) 
//     //         })
            
//     //     },1000)
//     //     return ()=>{
//     //         clearInterval(interval)
//     //     }
//     // })

    

// class Graph extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       airData:[],
//       data:{},
//       options:{},
//       ppm:[],
//       time:[]
//     }
//     this.handleDatabase = this.handleDatabase.bind(this);
//   } 

//   handleDatabase(){
//   }

//   componentDidMount() {
//     db.collection('airData').orderBy("timestamp","desc").limit(1).onSnapshot(snapshot=>{
//       let tempArray=[]
//       let temptimeVal=[]
//       let tempppmVal=[]
//       snapshot.docs.map(snap => {
//         tempArray.push(snap.data())
//         // console.log(snap.data().airquality)
//         temptimeVal.push(snap.data().stringtime)
//         tempppmVal.push(snap.data().airquality)
//       })
//       this.setState({
//         airData: tempArray,
//         ppm:tempppmVal,
//         time:temptimeVal
//       })
//     })
    
//     const data = {
//       datasets: [
//         {
//           label: "CO2 PPM",
//           borderColor: "rgb(255, 99, 132)",
//           backgroundColor: "rgba(255, 99, 132, 0.5)",
//           lineTension: 0,
//           borderDash: [8, 4],
//           data: []
//         }
//       ]
//     };
//     this.setState({
//       data:data
//     })
//     console.log(this.state.ppm)
//     const options = {
//       scales: {
//         xAxes: [
//           {
//             type: "realtime",
//             realtime: {
//               onRefresh: function() {
//                 data.datasets[0].data.push({
//                   x: Date.now(),
//                   y: Math.random() * 100
//                 });
//               },
//               delay: 2000
//             }
//           }
//         ]
//       }
//     };
//     this.setState({
//       options:options
//     })
//   }
//     render(){
//       return  <div className="graph__main container">
//         {/* <Line data={this.state.data} options={this.state.options}/> */}
//         <Linegraph data={this.}/>
//       </div>
//     }
// }

// export default Graph

import React, { useState , useEffect} from 'react'
import db from '../../firebase'
import {Line} from 'react-chartjs-2'
import "chartjs-plugin-streaming";
import ReactApexChart from 'react-apexcharts';
import './GraphStyles.css'

function Graph() {
  const [airData,setAirData] = useState()
  const [time,setTime] = useState([])
  const [ppm,setPPM] = useState([])
  const [soundState, setSoundState] = useState()

  
  useEffect(()=>{
    db.collection("airData").orderBy("timestamp","asc").limitToLast(15).onSnapshot(snapshot =>{
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
      <div className="container-fluid row cos-row">
        <div className="graph__main col-md-6" style={{paddingTop:5,paddingLeft:0}}>
          <p>*ALL VALUES ARE UPDATED EVERY 10 MINUTES</p>
          <div className="main_chart">
            <ReactApexChart options={datas.options} series={datas.series} type="line" height={450}/>
          </div>
          <div className="sec_chart">
            <ReactApexChart options={datas.optionsLine} series={datas.seriesLine} type="area" height={130}/>
          </div>
        </div>
        <div className="sound_main col-md-6 " style={{paddingTop:5,paddingLeft:0}}>
          <div className="col">
            <div className="imageSound row">
              <p>*SOUND STATE</p>
              <img alt="sound" src="https://static.thenounproject.com/png/822072-200.png"/>
              <h4>Sound State : {soundState?.soundState}</h4>
            </div>
            <div className="row text">
              <h6 className="text-title">Air Quality Control</h6>
              <ul>
                <li>250-350 ppm: background (normal) outdoor air level</li>
                <li>350-1,000 ppm: typical level found in occupied spaces with good air exchange</li>
                <li>1,000-2,000 ppm: level associated with complaints of drowsiness and poor air</li>
                <li>2,000-5,000 ppm: level associated with headaches, sleepiness, and stagnant, stale, stuffy air; poor concentration, 
                  loss of attention, increased heart rate and slight nausea may also be present.</li>
                <li>{'>'}5,000 ppm: This indicates unusual air conditions where high levels of other gases also could be present. Toxicity or oxygen deprivation could occur. 
                  This is the permissible exposure limit for daily workplace exposures.</li>
                <li>{'>'}40,000 ppm: This level is immediately harmful due to oxygen deprivation.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Graph
