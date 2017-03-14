import $ from 'jquery'
import {Component,VNode,findDOMNode} from 'preact'
import cad from 'cad'
import Slice from './slice'
import DataLabel from '../../widget/dataLabel'
import ConnectLine from './connect-line'
class  Pie extends Component{
	getDefaultProps(){
		return {
			series: {
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
					distance:30
				},
				roseType:false,//南丁格尔玫瑰'radius'：同时半径和角度按比例变化,'area'角度相同，半径不同
				selectMode:"single",//多选模式
				size:0.75,//外径
				minSize:40,//最小半径
				innerSize:0,//内径
				startAngle:0,//起始角度，以上向为0
				endAngle:null,//不写则始终角差360，指定则按指定的来
				sliceOffset:10,//选中时的偏移量
				states:{
					hover:{
					}
				}
			}
		}
	}
	getRenderData(props,oldState){
		var {series,width,height,option} = props;
		var colors = option.colors;
		var {data,color} = series;
		if(series.colors) {
			colors = series.colors;
		}
		var arr_value = data.map(function(val){
			return val.value;
		})
		var sum = cad.sum(arr_value);
		var max_num = cad.max(arr_value);
		var min_num = cad.min(arr_value);
		var mean_num = cad.mean(arr_value);
	    var cx = series.center[0]*width;
	    var cy = series.center[1]*height;
	    var innerSize = series.innerSize;
	    var size = series.size;
	    var radius = Math.min(width,height)*size/2;
	    radius = Math.max(radius,series.minSize);
	    var startAngle = series.startAngle - 90;
	    var points = [];
	    var endAngle = series.endAngle?(series.endAngle - 90):(startAngle+360);
	    var totalAngle = endAngle - startAngle;
	    var roseType = series.roseType;
	    data.reduce(function(startAngle,curData,index){
	    	var percent = curData.value/sum
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
	        	midAngle:(startAngle + endAngle)/2,
	        	selected:curData.selected,
	        	label:data[index].name,
	        	x:index,
	        	y:curData.value,
	        	percent:percent.toFixed(2)
	        };
	        if(color) {
	        	//颜色差以和平均值差对比
	        	if(max_num - min_num > 0) {
	        		obj.color = cad.brighten(color,(curData.value - mean_num)/(max_num - min_num )*0.5);
	        	} else {
	        		obj.color = color;
	        	}
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
	    //保留已选中的状态
	    if(oldState) {
	    	points.map(function(p,index){
	    		var oldP = oldState.points[index];
	    		if(oldP) {
	    			p.selected = oldP.selected;
	    			p.isAdded = false;
	    		} else {
	    			//新增的节点
	    			p.isAdded = true;
	    			p.prevOption = {
	    				cx:oldState.cx,
	    				cy:oldState.cy,
	    				radius:oldState.radius,
	    				innerRadius:oldState.innerRadius
	    			}
	    		}
	    	})
	    }
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
	}
	getInitialState(){
		return this.getRenderData(this.props);
	}
	render(){
		var that = this;
		var {width,height,series} = this.props;
		var paper  =new cad.Paper();
		var points = this.state.points;
		var {center,size,dataLabels,borderColor,borderWidth,sliceOffset} = series;
		var {cx,cy,radius,innerRadius} = this.state;
		var virtualDOM = new VNode("g");
		paper.switchLayer(virtualDOM);
		var connectLayer = paper.g({className:"connect-line-layer"}).attr("fill","none");
		var pointLayer = paper.g({className:"points-group"});
		var labelLayer = paper.g({className:"label-layer"}).css("font-family","Microsoft Yahei, sans-serif");
		paper.switchLayer(pointLayer);
		points.map(function(point,index){
			paper.append(Slice,{
				cx:cx,
				cy:cy,
				startAngle:point.startAngle,
				endAngle:point.endAngle,
				radius:point.radius,
				innerRadius:innerRadius,
				selected:point.selected,
				midAngle:point.midAngle,
				borderWidth:borderWidth,
				borderColor:borderColor,
				color:point.color,
				index:index,
				selected:point.selected,
				sliceOffset:sliceOffset,
				onSlice:that.onSlice.bind(that,index),
				isAdded:point.isAdded,
				updateType:point.updateType || "newProps",
				prevOption:point.prevOption
			})
		});
		points.map(function(p,index){
			var textPoint;
			var hide  = false;
			var midAngle  = p.midAngle;
			if(dataLabels.inside) {
				textPoint = {x:cx,y:cy};
				hide = true;
			} else {
				textPoint = cad.Point(cx,cy).angleMoveTo(midAngle,radius + dataLabels.distance);
			}
			var textOption = {
				fontSize:13,
				textBaseLine:"middle"
			};
			if(dataLabels.inside || dataLabels.distance < 0 ) {
				textOption.textAlign = "center";
			} else {
				textOption.textAlign = (midAngle>-90&&midAngle<90)?"left":"right";
			}
			paper.switchLayer(labelLayer);
			//文本略微偏移
			var dx = 0;
			if(textOption.textAlign === "left") {
				dx = 3;
			} else if(textOption.textAlign === "right") {
				dx = -3;
			}
			var length2 = 20;//水平引线长度,需要考虑超出最大长度
			//三角形正弦定理 2*sin(A)/a = 1/R;其中A为角,a为对边长,R为外接圆半径;
			/*var maxLength2 = 3
			var startPoint = cad.Point(cx,cy).angleMoveTo(midAngle,p.radius);
			var hline = new cad.Line(startPoint.x,startPoint.y,startPoint.x+5,startPoint.y);
			var crossPoints = hline.getPointWithCircle(cx,cy,p.radius);*/
			var rotate = cad.asin(cad.sin(midAngle)*length2/(radius + dataLabels.distance));
			if(textOption.textAlign === "left") {
				rotate*= -1;
			}
			textPoint.rotate(rotate,cx,cy);

			paper.append(DataLabel,{
				x:textPoint.x + dx,
				y:textPoint.y,
				text:p.label,
				style:{
					color:"#fff",
					display:hide?"none":"",
					pointerEvents:"none",
					textAlign:textOption.textAlign,
					textBaseLine:"middle"
				}
			})
			paper.switchLayer(connectLayer);
			paper.append(ConnectLine,{
				cx:cx,
				cy:cy,
				radius:p.radius,
				midAngle:p.midAngle,
				x:textPoint.x,
				y:textPoint.y,
				textAlign:textOption.textAlign,
				lineStyle:{
					color:"#fff",
					width:1,
					dash:0
				}
			})
		});
		paper.destroy();
		return virtualDOM;
	}
	onSlice(index){
		var points = this.state.points;
		var selectMode = this.props.series.selectMode;
		var sliced = !points[index].selected;
		points.map(function(point,key){
			if(key === index) {
				point.selected = sliced;
			} else {
				if(sliced) {
					if(selectMode === "single") {
						point.selected = false;
					}
				}
			}
			point.updateType = "select";
		})
		this.setState({points:points});
	}
	animate(){
		var {width,height,option,series} = this.props;
		var serieIndex = series.index;
		var sliceOffset = series.sliceOffset;
		var {cx,cy,radius,startAngle,endAngle} = this.state;
		var el = findDOMNode(this);
		var svg = $(el).closest("svg").get(0);
		var paper = new cad.Paper(svg);
		var group = $(findDOMNode(this));
		var clip = paper.clipPath(function(){
			paper.addShape("sector",cx,cy,{
							radius:radius + sliceOffset,
							startAngle:startAngle,
							endAngle:startAngle + 1e-6
						});
		});
		clip.attr("id","pie-clip"+serieIndex);
		group.attr("clip-path","url(#pie-clip"+ serieIndex +")");
		var path = clip.find("path");
		path.transition({
			from:startAngle,
			to:endAngle,
			ease:'easeIn',
			during:600,
			callback(){
				clip.remove();
				group.removeAttr("clip-path");
			},
			onUpdate:function(val){
				path.attr("d",cad.getShapePath("sector",cx,cy,{
					startAngle:startAngle,
					endAngle:val,
					radius:radius + sliceOffset
				}));
			}
		})
		paper.destroy();
	}
	componentDidMount(){
		window.pie = this;
		this.animate();
	}
	componentWillReceiveProps(nextProps){
		var el = $(findDOMNode(this)).find(".points-group,.label-layer");
		el.stopChildrenTransition(true);
		this.setState(this.getRenderData(nextProps,this.state));
	}
}
module.exports = Pie;