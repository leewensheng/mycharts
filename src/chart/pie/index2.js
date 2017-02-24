import $ from 'jquery'
module.exports = Pie;
var Pie = createClass({
	getDefaultProps(){
	  	return {
			color:null,//主色
			colors:null,//系列色
			center:[0.5,0.5],//中心位置
			borderColor:"#fff",//描边颜色
			borderWidth:0,//描边
			data:[], //数据{name:'slcie1',value:1,color:'#fff',selected:true}
			dataLabels:{
				enabled:true,
				inside:false
			},
			roseType:false,//南丁格尔玫瑰'radius'：同时半径和角度按比例变化,'area'角度相同，半径不同
			selectMode:"single",//多选模式
			size:0.75,//外径
			minSize:80,//最小直径
			innerSize:0,//内径
			startAngle:0,//起始角度，以上向为0
			endAngle:null,//不写则始终角差360，指定则按指定的来
			sliceOffset:10,//选中时的偏移量
			states:{
				hover:{
					
				}
			}
		}
	},
	getInitialState(){
		var series = this.props.series;
		var chart = this.props.chart;
		var {data,color,colors} = series;
		if(chart.option.colors) {
			colors = chart.option.colors;
		}
		var arr_value = data.map(function(val){
			return val.value;
		})
		var sum = cad.sum(arr_value);
		var max_num = cad.max(arr_value);
		var min_num = cad.min(arr_value);
		var mean_num = cad.mean(arr_value);
	    var cx = series.center[0]*chart.width;
	    var cy = series.center[1]*chart.height;
	    var innerSize = series.innerSize;
	    var size = series.size;
	    var radius = Math.min(chart.width,chart.height)*size/2;
	    radius = Math.max(radius,series.minSize);
	    var startAngle = series.startAngle - 90;
	    var points = [];
	    var endAngle = series.endAngle?(series.endAngle - 90):(startAngle+360);
	    var totalAngle = endAngle - startAngle;
	    var roseType = series.roseType;
	    data.reduce(function(startAngle,curData,index){
	    	var percent = curData.value/sum;
	    	var endAngle;
	        if(roseType !== "area") {
	       		endAngle = startAngle + percent*totalAngle;
	        } else {
	        	endAngle = startAngle + totalAngle/(data.length);
	        }
	        //point state
	        var obj = {
	        	startAngle:startAngle,
	        	endAngle:endAngle,
	        	selected:curData.selected
	        };
	        if(!colors && color) {
	        	//颜色差以和平均值差对比
	        	obj.color = cad.brighten(color,(curData.value - mean_num)/(max_num - min_num )*0.5);
	        } else {
	        	obj.color = colors[index%colors.length];
	        }
	        obj.radius = radius;
	        if(roseType === "radius" || roseType === "area") {
	        	obj.radius  = curData.value/max_num*radius;
	        } 
	        points.push(obj);
	        return endAngle;
	    },startAngle);

	    if(roseType === "radius" || roseType === "area")  {
	     	innerSize = 0;
	    }
	    return {
	    	points:points,
	    	cx:cx,
	    	cy:cy,
	    	radius:radius,
	    	startAngle:startAngle,
	    	endAngle:endAngle,
	    	innerRadius:radius*innerSize
	    }
	},
	render(){
		var {chart,seriesGroup,series} = this.props;
		var paper  = chart.getPaper();
		var points = this.state.points;
		var {width,height} = chart;
		var {center,size,dataLabels,borderColor,borderWidth} = series;
		var {cx,cy,radius,innerRadius} = this.state;
		var virtualDOM = paper.createVirtualDOM("g");
		this.group = virtualDOM;
		paper.switchLayer(virtualDOM);
		var slice = paper.g();
		paper.switchLayer(slice);
		points.map(function(point){
			paper.addShape("sector",cx,cy,{
				startAngle:point.startAngle,
				endAngle:point.endAngle,
				radius:point.radius,
				innerRadius:point.innerRadius
			}).attr("fill",point.color)
			  .attr("stroke",borderColor)
			  .attr("stroke-width",borderWidth)
		});
		return virtualDOM;
	},
	componentDidMount(){

	},
	animate(){

	},
	componentWillReceiveProps(){

	},
	componentWillUnmount(){

	}
})