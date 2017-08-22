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
		top:50,
		left:80,
		containLabel:1,
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
		}
	},
	series:[
	{
		type:'line',
		data:[1,2,1],
		stack:1
	},{
		type:'line',
		data:[-2,1,3],
		stack:1,
	}]
}

var chart = vchart.init(el,{
	height:400
});
chart.setOption(option);