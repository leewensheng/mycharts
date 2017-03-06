import vchart from '../src/index.js'
import cad from 'cad'
import $ from 'jquery'
var el = document.getElementById("root");
var t1 = Date.now();
var chart = vchart.init(el,{height:400});
chart.setOption({
	chart:{
		background:'#2A3139',
	},
	series:[
		{
			name:'a pie chart',
			/*color:'#c23531',*/
			data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:274, name:'联盟广告'},
                {value:235, name:'视频广告'},
                {value:400, name:'搜索引擎'}
            ].sort(function (a, b) { return a.value-b.value}),
			sliceOffset:20,
			size:0.75,
			minSize:80,
			innerSize:0,
			startAngle:0,
			endAngle:null,
			selectMode:"single",
			roseType:false,//radius false area
			borderColor:"#fff",
			borderWidth:0,
			center:[0.5,0.5],
			dataLabels:{
				enabled:true,
				inside:false,
				distance:-30,
				style:{
					fontSize:11
				}
			}
		}
	]
});
var t2 = Date.now();
console.log('total-time:'+ (t2-t1)+'ms');
$("<button>test</button>").appendTo("body")
.on("click",function(){
	var data = chart.option.series[0].data;
	data.push({value:200,name:"广告来源"})
	chart.setOption({
		chart:{

		},
		series:[
			{	color:"red",
				sliceOffset:20,
				data:data,
				innerSize:0.5,
				selectMode:"mutiple",
				dataLabels:{
					inside:0
				}
			}
		]
	})
})