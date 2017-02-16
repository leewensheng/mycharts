import mychart from '../src/index.js'
import '../../src/index'

var el = document.getElementById("root");
var t1 = Date.now();
var chart = mychart.init(el,{width:600,height:400});
chart.setOption({
	chart:{
		background:'gray',
	},
	series:[
		{
			name:'a pie chart',
			data:[11,11,11,12,11],
			sliceOffset:20,
			size:0.75,
			innerSize:0,
			center:[0.5,0.5],
			dataLabels:{
				inside:false
			}
		}
	]
});
var t2 = Date.now();
console.log('total-time:'+ (t2-t1)+'ms');