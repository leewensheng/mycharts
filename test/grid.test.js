import vchart from '../src/index.js'
import $ from 'jquery'

var el = document.querySelector('#root');
var base = +new Date(1968, 9, 3);
var oneDay = 24 * 3600 * 1000;
var date = [];
var data = [Math.random() * 300];
for (var i = 1; i < 10; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push((Math.random() - 0.1)*300000);
}
date.push(Date.now())
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
		left:20,
		right:80,
		bottom:150,
		containLabel:1,
		background:'#eee'
	},
	legend:{
		align:'center',
		margin:40
	},
	xAxis:{
		type:'category',
		startOnTick:1,
		gridLine:{
			enabled:false,
			lineWidth:1,
			color:'#e6e6e6'
		},
		axisTick:{
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
		},
		categories:date
	},
	yAxis:{
		min:0,
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
			enabled:1,
			lineColor:'red'
		},
	},
	plotOptions:{
		bar: {
			barWidth:null,
			borderWidth:0,
			borderColor:"#fff",
			borderRadius:'20%',
			minBarLength:20,
			maxBarWidth:500,
			groupIng:true
		}
	},

	series:[
        {
			type:'line',
			borderWidth:1,
			borderColor:'#fff',
			data:data
		},
		{
			type:'bar',
			borderWidth:1,
			borderColor:'#fff',
			data:[1,2,3,4,5,6]
		}
    ]
}
var chart = vchart.init(el,{
	height:600
});
chart.setOption(option);