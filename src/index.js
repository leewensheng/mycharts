import Chart from './chart'
import charts from './chart/charts'

var vchart = {
	init:function(el,option){
		return new Chart(el,option);
	},
    defineChart:function(type,chart){
    	if(Array.isArray(type)) {
    		type.map(function(val){
    			charts[val] = chart;
    		})
    	} else {
        	charts[type] = chart;
    	}
    }
}
module.exports = vchart;