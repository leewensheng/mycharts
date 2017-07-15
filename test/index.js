
import vchart from '../src/index.js'
import $ from 'jquery'
var el = document.getElementById("root");
var t1 = Date.now();
var chart = vchart.init(el,{height:400});
var data = [];
for(var i = 0; i <3; i++) {
    data.push({
        value:300*Math.random(),
        name:"series"+i
    })
};
var option = {
	chart:{
		animation:true,
		background:'#ddd',
	},
	series:[
		{	
            type:'pie',
            color:"darkred",
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
			size:0.55,
			minSize:80,
			innerSize:0,
			startAngle:0,
			endAngle:null,
			selectMode:"single",
			roseType:'radius',//radius false area
			borderColor:"#fff",
			borderWidth:2,
			center:[0.2,0.5],
			dataLabels:{
				enabled:true,
                color:"#fff",
				inside:false,
				distance:50,
				style:{
					fontSize:11
				}
			},
            connectLine:{
                enabled:true,
                lineColor:''
            }
		},
        {
			type:"pie",
			data:data,
            size:0.5,
            innerSize:0.2,
            dataLabels:{
                color:"#333",
                enabled:1,
            	distance:20,
                inside:false
            },
            connectLine:{
                enabled:true,
                leadLength:10,
                lineStyle:{
                }
            },
            center:[0.7,0.5]
		},
        {
            type:'line',
            data:[1,20,30,0,300],
            lineWidth:2,
            lineDash:'solid',
            linecap:'round',
            marker:{
                enabled:false
            }
        },{
            name:'系列',
            type:'line',
            data:[5,30,58]
        },{
            type:'line',
            lineWidth:2,
            data:[5,30,58],
            yAxis:1
        }
	],
    grid:{
        top:80,
        containLabel:true
    },
    xAxis:{
    	gridIndex:0,//所属网格区域
        min:null,
        max:null,//对于分类轴来说仍然是有意义的
        minRange:null,
        splitNumber:5,//分割段数
        data:['1','2','3','4','5'],//分类轴用到
        opposite:false,
        inverse:false,//数值反转
        title:{
            show:true,
            align:"start",//start middle end
            margin:15,
            rotation:0,
            style:{
                color:"#666"
            },
            text:"",
        },
        axisLine:{
            show:true,
            lineStyle:{
                color:"#333",
                width:1,
                type:"solid"
            }
        },
        axisTick:{
            show:true,
            interval:"auto",
            inside:true,
            length:5,
            lineStyle:{
                color:"#333",
                width:1,
                type:"solid",
            }
        },
        axisLabel:{
            show:true,
            interval:'auto',
            inside:false,
            rotate:0,
            margin:8,
            textWidth:null,//强制宽度
            formatter:null,
            style:{
                color:'red',
                fontSize:12,
                textAlign:"center",
                textBaseLine:"bottom"
            }
        },
        gridLine:{
            lineStyle:{
                color:'#333'
            }
        }
    },
    yAxis:[
        {
            gridLine:{
                lineStyle:{
                    color:'#333'
                }
            }
        },
        {
            axisLine:{

            },
            axisTick:
            {
                inside:true,
                enabled:true
            },
            axisLabel:
            {
                inside:true,
                margin:30,
                enabled:true
            },
            gridLine:{
                enabled:false
            }
    }],
    legend:{
        padding:5,
        margin:10,
        align:'center',
        itemHeight:20,
        itemWidth:90,
        borderWidth:0.5,
        borderRadius:5,
        background:"#fff",
        layout:'horizontal',
        itemGap:10,
        itemStyle:{
            fontSize:12,
            textBaseLine:'middle'
        }
    }
};
chart.setOption(option);
var t2 = Date.now();
console.log('total-time:'+ (t2-t1)+'ms');
document.title = t2 - t1 ;
var btn = $("<button>test2</button>").appendTo("body")
.on("click",function(){
    option.series[1].showInLegend = false;
    option.series[1].data.push({name:'haha',value:Math.random()*100+50});
    chart.setOption(option)
})