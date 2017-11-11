import vchart from '../src/index.js'
import $ from 'jquery'

var el = document.querySelector('#root');
var date = [];
var base = +new Date(1968, 9, 3);
var oneDay = 24 * 36 * 1000;
var data = [Math.random() * 300];
for (var i = 1; i < 500; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
}
var option = {
	colors:[{
		type:'linearGradient',
		stops:[
			[0,'blue'],
			[1,'red']
		]
	},{
		type:'linearGradient',
		stops:[
			[0,'black'],
			[1,'darkred']
		]
	},'red'],
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
		min:0,
		opposite:0,
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
			lineColor:'#333',
			lineWidth:1
		},
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
		inverse:0,
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
			borderWidth:1,
			borderColor:"#fff",
			borderRadius:0,
			minBarLength:20,
			maxBarWidth:500,
			groupIng:true
		},
		line:{
			dataLabels:{
				enabled:false
			}
		}
	},

	series:[
		{
			type:'line',
			stack:1,
			lineWidth:1,
			data:data
		},{
			type:'line',
			stack:1,
			data:[50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,50,30,20,40,30,20,]
		}
	],
	dataZoom:[{
		xAxis:0
	}]
}
var chart = vchart.init(el,{
	height:600
});
chart.setOption(option);