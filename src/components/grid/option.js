 module.exports = {
    grid:{
        left:30,
        top:30,
        bottom:30,
        right:30,
        background:'transparent',
        containLabel:true
    },
    axis:{
        gridIndex:0,//所属网格区域
	    min:null,
	    max:null,//对于分类轴来说仍然是有意义的
	    minRange:null,
	    splitNumber:5,//分割段数
	    data:[],//分类轴用到
	    opposite:false,
	    inverse:false,//数值反转
	    title:{
	        enabled:true,
	        align:"start",//start middle end
	        margin:0,
	        rotation:0,
	        style:{
	            color:"#666"
	        },
	        text:"",
	    },
	    axisLine:{
	        enabled:true,
	        lineColor:'blue',
	        lineWidth:1,
	        lineDash:false,
	        style:{

	        }
	    },
	    gridLine:{
	    	enabled:true,
	        lineColor:'red',
	        lineWidth:1,
	        lineDash:false,
	    	style:{
	    
	    	}
	    },
	    axisTick:{
	        enabled:true,
	        interval:"auto",
	        inside:false,
	        length:5,
	        lineColor:'red',
	        lineWidth:1,
	        lineDash:false,
	        style:{

	        }
	    },
	    axisLabel:{
	        enabled:true,
	        interval:'auto',
	        inside:false,
	        rotate:0,
	        margin:8,
	        rotation:'auto',
	        textWidth:null,//强制宽度
	        formatter:null,
	        style:{
	            color:'#333',
	            fontSize:12,
	            textAlign:"center",
	            textBaseLine:"bottom"
	        }
	    }
    }
}