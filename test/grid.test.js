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
	grid:{
		top:80,
		left:80,
		right:80,
		containLabel:0,
		background:'#ddd'
	},
	xAxis:{
		gridLine:{
			enabled:0,
			lineWidth:5,
			color:'blue'
		},
		opposite:0,
		title:{
			text:'haha'
		},
		min:0,
		gridLine:{
			enabled:true
		}
	},
	yAxis:{
		title:{
			text:'liws',
			style:{
				color:'red'
			}
		},
		axisTick:{
			inside:true
		},
		min:0
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
		size:50,
		borderWidth:0,
		borderColor:'#3B98A2',
		type:'scatter',
		data:[
			[1,2,3],
			[2,4,3],
			[4,6,3],
			[2,2.5,3],
			[1,1.5,2],
			[2,2.2,5]
		]
	},
	{
		type:'pie',
		data:[{
			name:'330',
			value:300
		},{
			name:'333',
			value:550
		}]
	},
	]
}
for(var i = 0; i < 30;i++) {
	data.push([

		Math.random()*5,
		Math.random()*5,
		3
		])
}
option.series[0].data = data;
var chart = vchart.init(el,{
	height:400
});
chart.setOption(option);