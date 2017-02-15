import Chart from './chart'
var mychart = {
	init:function(el,option){
		return new Chart(el,option);
	}
}
module.exports = mychart;