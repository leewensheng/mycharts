import React from 'react'
import ReactDOM from 'react-dom'
import Core from '../src/chart/core'
var date = ['0月'];
var base = +new Date(1968, 9, 3);
var oneDay = 24 * 36 * 1000;
var data = [parseInt(Math.random() * 300)];
for (var i = 1; i < 12; i++) {
    var now = new Date(base += oneDay);
    date.push(i + '月');
   var val = (Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
   data.push(parseInt(val));
}
var options =[ 
    {
        title:{
            text:'常规柱状图',
            margin:0
        },
        xAxis:{
            categories:date,
            startOnTick:true,
        },
        series:[
            {
                type:'bar',
                data:data
            }
        ]
    },
    {
        title:{
            text:'渐变圆角柱状图',
            margin:0
        },
        xAxis:{
            categories:date,
            startOnTick:true,
        },
        series:[
            {
                type:'bar',
                smooth:true,
                data:data,
                borderRadius:15,
                color:{
                    type:'linearGradient',
                    x1:0,
                    x2:0,
                    y1:0,
                    y2:1,
                    stops:[
                       [0,'red'],
                       [1,'pink']
                    ]
                }
            }
        ]
    },
    {
        title:{
            text:'堆叠柱状图',
            margin:0
        },
        xAxis:{
            categories:date,
            startOnTick:true,
        },
        series:[
            {
                type:'bar',
                smooth:true,
                data:data,
                stack:1
            },
            {
                type:'bar',
                smooth:true,
                data:data,
                stack:1
            }
        ]
    },
    {
        title:{
            text:'坐标轴翻转柱状图',
            margin:0
        },
        yAxis:{
            categories:date,
            inverse:true,
            startOnTick:true,
        },
        series:[
            {
                type:'bar',
                smooth:true,
                data:data
            }
        ]
    },
    {
        title:{
            text:'带负值的面积图',
            margin:0
        },
        xAxis:{
            axisLine:{
                lineColor:'#000'
            },
            startOnTick:true,
            categories:['一','二','三','四','五','六'],
        },
        series:[
            {
                type:'bar',
                smooth:true,
                data:[1,-1,2,-2,3,-3]
            }
        ]
    },
]
class Line extends React.Component {
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
ReactDOM.render(<Line />,document.querySelector('#root'));