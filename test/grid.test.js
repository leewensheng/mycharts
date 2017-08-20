import vchart from '../src/index.js'
import $ from 'jquery'

var el = document.querySelector('#root');
var option = {
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
		}
	},
	series:[
	{
		type:'bar',
		data:[1,2,3],
		stack:1,
		showInLegend:false
	},{
		type:'line',
		data:[2,-3,5],
		stack:1
	}]
}

var chart = vchart.init(el,{
	height:400
});
chart.setOption(option);