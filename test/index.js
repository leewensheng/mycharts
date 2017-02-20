import mychart from '../src/index.js'
import '../../src/index'

var el = document.getElementById("root");
var t1 = Date.now();
var chart = mychart.init(el,{height:400});
chart.setOption({
	chart:{
		background:'#F3F3F3',
	},
	colors:['#C23531',"#E98F6F","#9FDABF","#749F83","#DE9325","#CA8622","#BDA29A","#797B7F","#546570"],
	series:[
		{
			name:'a pie chart',
			data:[335,320,234,135,1048,251,147,102,335],
			sliceOffset:20,
			size:0.75,
			minSize:80,
			innerSize:0,
			startAngle:0,
			selectMode:"single",
			borderColor:"#fff",
			borderWidth:0,
			center:[0.5,0.5],
			dataLabels:{
				enabled:true,
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