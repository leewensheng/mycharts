import React from 'react'
import ReactDOM from 'react-dom'
import Core from '../src/chart/core'
var data = [];
var bubble =  []
for(var i = 0;i  < 500;i++) {
    let x = Math.random()*100;
    let y = Math.random()*100;
    data.push([x,y]);
    i<50&&bubble.push({
        x,y,value:Math.random()*100
    })
}
var options =[ 
    {
        title:{
            text:'散点图',
            margin:0
        },
        series:[
            {
                type:'scatter',
                size:8,
                color:'rgba(255,0,0,0.5)',
                data:data
            }
        ]
    },
    {
        title:{
            text:'气泡图',
            margin:0
        },
        series:[
            {
                type:'bubble',
                size:8,
                borderWidth:1,
                borderColor:'red',
                color:'rgba(255,0,0,0.5)',
                data:bubble
            }
        ]
    },
    {
        title:{
            text:'渐变气泡图',
            margin:0
        },
        series:[
            {
                type:'bubble',
                borderColor:'red',
                color:{
                    type:'radialGradient',
                    cx:0.4,
                    cy:0.3,
                    r:1,
                    stops:[[0,'rgba(251, 118, 123,0.6)'],[1,'rgba(204, 46, 72,0.6)']]
                },
                data:bubble
            }
        ]
    }
]
class Scatter extends React.Component {
    render(){
        return (
        <ul style={{width:1200,oveflow:'auto',padding:0,margin:0}}>
        {
            [0,1,2,3,4,5,4,5,5,5,5,5,5].map((val,index) =>{
                if(!options[index]) return;
                return <li style={{float:'left'}} key={index}>
                    <Core  width={600} height={300} option={options[index]} />
                </li>
            })
        }
        </ul>
        )
    }
}
ReactDOM.render(<Scatter />,document.querySelector('#root'));