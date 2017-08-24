import vchart from '../src/index.js'
import $ from 'jquery'

var el = document.querySelector('#root');
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
		containLabel:0,
		background:'#ddd'
	},
	xAxis:{
		categories:['甲','乙','丙'],
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
			groupIng:false
		}
	},
	series:[
	{
		name:'series1',
		type:'bar',
		data:[2,2,5],
		stack:1
	},
	{
		name:'series2',
		type:'bar',
		data:[2,2,4],
		stack:1
	}]
}

var chart = vchart.init(el,{
	height:400
});
chart.setOption(option);