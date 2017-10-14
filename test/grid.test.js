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
		left:80,
		right:80,
		bottom:150,
		containLabel:0,
		background:'#fff'
	},
	legend:{
		align:'center',
		margin:40
	},
	xAxis:{
		type:'category',
		categories:[10,20,30,20,15,24,10,8,11,12,10,22,10,22,12,32,12,33,25].map(function(val,index){return index}),
		gridLine:{
			enabled:0,
			lineWidth:5,
			color:'#e6e6e6'
		},
		axisLine:{
			onZero:1,
			lineColor:'#000'
		},
		opposite:0,
		title:{
			text:'haha',
			margin:10,
			align:'end',
		},
		gridLine:{
			enabled:0
		}
	},
	yAxis:{
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
		gridLine:{
			enabled:1,
			lineColor:'red'
		}
	},
	plotOptions:{
		bar: {
			barWidth:null,
			minBarLength:5,
			maxBarWidth:50,
			groupIng:true
		}
	},

	series:[
		{
			type:'line',
			data:[10,20,30,20,15,24,10,8,11,12,10,22,10,22,12,32,12,33,25]
		}
	]
}
var chart = vchart.init(el,{
	height:400
});
chart.setOption(option);