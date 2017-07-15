module.exports = 
 {
	color:null,//主色
	colors:null,//系列色
	center:[0.5,0.5],//中心位置
	borderColor:"#fff",//描边颜色
	borderWidth:0,//描边
	data:[], //数据{name:'slcie1',value:1,color:'#fff',selected:true}
	dataLabels:{
		enabled:true,
		show:false,
		inside:false,
		distance:30,
		style:{
			fontSize:12,
		}
	},
	connectLine:{
		enabled:true,
		leadLength:20,
		lineColor:'',
		lineWidth:1,
		lineDash:'',
		style:{
			
		}
	},
	roseType:false,//南丁格尔玫瑰'radius'：同时半径和角度按比例变化,'area'角度相同，半径不同
	selectMode:"single",//多选模式
	size:0.75,//外径
	minSize:40,//最小半径
	innerSize:0,//内径
	startAngle:0,//起始角度，以上向为0
	endAngle:null,//不写则始终角差360，指定则按指定的来
	sliceOffset:10,//选中时的偏移量
	visible:true,
	states:{
		hover:{
		}
	}
}
	