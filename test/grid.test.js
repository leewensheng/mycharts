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
		containLabel:1,
		background:'#fff'
	},
	legend:{
		align:'center',
		margin:40
	},
	xAxis:{
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
		min:0,
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
		color:{type:'radialGradient',cx:0.3,cy:0.4,r:1,stops:[
			[0,'rgba(129, 227, 238,0.9)'],
			[1,'rgba(25, 183, 207,0.9)']
		]},
		shadow:false,
		symbol:'circle',
		borderWidth:1,
		borderColor:'#3B98A2',
		type:'bubble',
		style:{
			cursor:'pointer'
		},
		size:8,
		maxSize:'15%',
		data:[
			[1,3,1],
			[2,3,2],
			[3,3,4],
			[4,3,8],
			[5,3,16],
			[6,3,32]
		]
	},
	{
		type:'bar',
		data:[1,-2,3,5]
	},{
		type:'pie',
		data:[1,2,3]
	},{
		type:'line',
		data:[10,20,30,20,15,24,10,8]
	}
	]
}
var data = [];
for(var i = 0; i < 50; i++ ){
	data.push([Math.random()*10,Math.random()*10,Math.random()*10]);
}
option.series[0].data = data;
var chart = vchart.init(el,{
	height:400
});
chart.setOption(option);