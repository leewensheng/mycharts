import vchart from '../src/index.js'
import $ from 'jquery'

var el = document.querySelector('#root');
var data = [];
var option = {
/*	colors:['blue',{
		type:'radialGradient',
		stops:[
			[0,'blue'],
			[1,'darkblue']
		]
	},{
		type:'radialGradient',
		stops:[
			[0,'red'],
			[1,'darkred']
		]
	},'red'],*/
	title:{
		text:'统计图表测试标题',
		margin:0,
		style:{
			color:'#000'
		},
		subTitle:{
			text:'子标题测试',
			style:{
				color:'#999'
			}
		}
	},
	grid:{
		top:100,
		left:50,
		right:80,
		bottom:150,
		containLabel:0,
		background:'#eee'
	},
	legend:{
		align:'center',
		margin:40
	},
	xAxis:{
		type:'value',
		gridLine:{
			enabled:true,
			lineWidth:1,
			color:'#e6e6e6'
		},
		axisLine:{
			onZero:1,
			lineColor:'#000'
		},
		opposite:0,
		axisLabel:{
			margin:20
		},
		title:{
			text:'haha',
			margin:10,
			align:'end',
		}
	},
	yAxis:{
		type:'category',
		startOnTick:true,
		title:{
			text:'李文胜',
			align:'top',
			margin:10,
			rotation:0,
			style:{
				color:'#333',
				fontSize:12
			}
		},
		axisTick:{
			inside:true
		},
		axisLine:{
			lineColor:"#000"
		},
		gridLine:{
			enabled:0,
			lineColor:'red'
		},
		categories : ['周一','周二','周三','周四','周五','周六','周日','周一','周五','周六']
	},
	plotOptions:{
		bar: {
			barWidth:null,
			borderWidth:10,
			borderColor:"blue",
			minBarLength:5,
			maxBarWidth:500,
			groupIng:true
		}
	},

	series:[
        {
            name:'利润',
            type:'bar',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data:[200, 170, 240, 244, 200, 220, 210]
        },
        {
            name:'收入',
            type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true
                }
            },
			data:[320, 302, 341, 374, 390, 450, 420],
        },
        {
            name:'支出',
			type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'left'
                }
            },
			data:[-120, -132, -101, -134, -190, -230, -210],
        }
    ]
}
var chart = vchart.init(el,{
	height:600
});
chart.setOption(option);