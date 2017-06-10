import Chart from './chart'
import cad from 'cad'
import {VNode} from 'preact'
import charts from './chart/charts'

cad.Paper.prototype.createVirtualDOM = function(tagName,attributes){
	return new VNode(tagName,attributes);
};
var vchart = {
	init:function(el,option){
		return new Chart(el,option);
	},
	cad:cad,
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