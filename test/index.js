import mychart from '../src/index.js'
import '../../src/index'

var el = document.getElementById("root");
var chart = mychart.init(el,{width:600,height:400});
chart.setOption({
	chart:{
		background:'gray',
	},
	series:[
		{
			data:[55,22,12]
		}
	]
});