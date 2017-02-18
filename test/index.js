import mychart from '../src/index.js'
import '../../src/index'

var el = document.getElementById("root");
var t1 = Date.now();
var chart = mychart.init(el,{height:400});
var data  = [];
for(var i = 0; i <10;i++) {
	data.push(1);
}
chart.setOption({
	chart:{
		background:'gray',
	},
	colors:['#00A1A1',"#28FFBB","#DB1774","#F20000","blue"],
	series:[
		{
			name:'a pie chart',
			data:data,
			sliceOffset:20,
			size:0.75,
			minSize:80,
			innerSize:0.8,
			startAngle:0,
			selectMode:"single",
			borderColor:"#fff",
			borderWidth:1,
			center:[0.5,0.5],
			dataLabels:{
				enabled:true,
				inside:false,
				style:{
					fontSize:11
				}
			}
		},
		{
			name:'a pie chart',
			data:data,
			sliceOffset:0,
			size:0.25,
			minSize:80,
			innerSize:0,
			startAngle:0,
			selectMode:"single",
			borderColor:"#fff",
			borderWidth:1,
			center:[0.5,0.5],
			dataLabels:{
				enabled:false,
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