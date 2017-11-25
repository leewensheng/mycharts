import React from 'react'
import ReactDOM from 'react-dom'
import Core from '../src/chart/core'
var options =[ 
    {
        title:{
            text:'常规饼图',
            margin:0
        },
        series:[
            {
                type:'pie',
                data:[1,2,3]
            }
        ]
    },
    {    title:{
            text:'单色玫瑰饼图',
            margin:0
        },
        series:[
            {
                type:'pie',
                color:'blue',
                roseType:'radius',
                data:[1,2,3]
            }
        ]
    },
    {    title:{
            text:'多色玫瑰饼图',
            margin:0
        },
        series:[
            {
                type:'pie',
                roseType:'area',
                data:[1,2,3]
            }
        ]
    },
    {   title:{
            text:'文本居内环状饼图',
            margin:0
        },
        series:[
            {
                type:'pie',
                innerSize:'50%',
                data:[1,2,3],
                dataLabels:{
                    distance:-30,
                    style:{
                        color:"#fff"
                    }
                }
            }
        ]
    },
    {   title:{
        text:'多饼图嵌套',
        margin:0
    },
        series:[
            {
                type:'pie',
                innerSize:'50%',
                data:[1,2,3]
            },{
                type:'pie',
                size:'30%',
                data:[1,2,3]
            }
        ]
    },
    {   
        title:{
            text:'半饼图',
            margin:0
        },
        series:[
            {
                type:'pie',
                center:['50%','60%'],
                startAngle:-90,
                endAngle:90,
                data:[1,2,3]
            }
        ]
    },
    {   
        title:{
            text:'默认选中',
            margin:0
        },
        series:[
            {
                type:'pie',
                data:[{selected:true,value:1},2,3]
            }
        ]
    },
]
class Pie extends React.Component {
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
ReactDOM.render(<Pie />,document.querySelector('#root'));