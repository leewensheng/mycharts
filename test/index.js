import mychart from '../src/index.js'
import '../../src/index'

var el = document.getElementById("root");
var t1 = Date.now();
var chart = mychart.init(el,{width:600,height:400});
chart.setOption({
	chart:{
		background:'gray',
	},
	colors:['#00A1A1',"#28FFBB","#DB1774","#F20000","blue"],
	series:[
		{
			name:'a pie chart',
			data:[1,1,1],
			sliceOffset:20,
			size:0.75,
			minSize:80,
			innerSize:0,
			startAngle:0,
			selectMode:"multiple",
			borderColor:"#fff",
			borderWidth:1,
			center:[0.5,0.5],
			dataLabels:{
				inside:false,
				style:{
					fontSize:11
				}
			}
		}
	]
});
var t2 = Date.now();
console.log('total-time:'+ (t2-t1)+'ms');