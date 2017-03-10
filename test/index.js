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
		{	color:"blue",
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
			roseType:'radius',//radius false area
			borderColor:"#fff",
			borderWidth:0,
			center:[0.2,0.5],
			dataLabels:{
				enabled:true,
				inside:false,
				distance:30,
				style:{
					fontSize:11
				}
			}
		},{
			type:"pie",
			data:[
				{value:335, name:'直接访问',selected:1},
                {value:310, name:'邮件营销'},
                {value:274, name:'联盟广告'}
            ],
            center:[0.7,0.5]
		}
	]
});
var t2 = Date.now();
console.log('total-time:'+ (t2-t1)+'ms');
$("<button>test</button>").appendTo("body")
.on("click",function(){
	var data = chart.option.series[0].data;
	data.push({value:200*Math.random()+100,name:"广告来源"})
	chart.setOption({
		chart:{

		},
		series:[
			{	
				color:cad.hsl(360*Math.random(),0.5,0.5),
				sliceOffset:20,
				data:data,
				borderWidth:1,
				borderColor:"#fff",
				size:Math.random()+0.2,
				innerSize:Math.random(),
				selectMode:"mutiple",
				dataLabels:{
					distance:Math.random()*20
				}
			}
		]
	})
})