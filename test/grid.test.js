import vchart from '../src/index.js'
import $ from 'jquery'

var el = document.querySelector('#root');
var option = {
	grid:{
		top:50,
		left:80,
		containLabel:false,
		background:'#ddd'
	},
	xAxis:{
		data:['甲','乙','丙'],
		gridLine:{
			enabled:false
		}
	},
	yAxis:{
		min:0
	},
	series:[
	{
		type:'line',
		data:[1,2,3],
		stack:1
	},{
		type:'line',
		data:[2,3,5],
		stack:1
	}]
}

var chart = vchart.init(el,{
	height:400
});
chart.setOption(option);