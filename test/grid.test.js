import vchart from '../src/index.js'
import $ from 'jquery'

var el = document.querySelector('#root');
var option = {
	colors:[{
		type:'linearGradient',
		stops:[
			[0,'red'],
			[1,'darkred']
		]
	},'red'],
	grid:{
		top:50,
		left:80,
		containLabel:1,
		background:'#ddd'
	},
	xAxis:{
		categories:['甲','乙','丙'],
		gridLine:{
			enabled:false
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
		data:[1,-2,3],
		stack:1
	},{
		type:'pie',
		data:[2,3,5],
		stack:1,
		innerSize:0.5,
		roseType:'radius'
	}]
}

var chart = vchart.init(el,{
	height:400
});
chart.setOption(option);