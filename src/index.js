import Chart from './chart'
import cad from 'cad'
import {VNode} from 'preact'
cad.Paper.prototype.createVirtualDOM = function(tagName,attributes){
	return new VNode(tagName,attributes);
};
var vchart = {
	init:function(el,option){
		return new Chart(el,option);
	},
	cad:cad
}
module.exports = vchart;