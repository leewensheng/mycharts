
module.exports = {
	enable:true,
	layout:'horizontal',
	align:'center',
	verticlAlign:'top',
	borderColor:'#999',//图例区域边框
	borderWidth:1,//
	borderRadius:0,
	background:'transparent',//图例背景色
	formatter:null,
	margin:12,
	padding:8,
	selectMode:'multiple',
	inactiveColor:'#ccc',

	itemWidth:'auto',
	itemHeight:16,
	itemGap:10,
	itemStyle:{
		fontSize:12
	},
	symbol:{
		width:16,
		padding:5,
		height:null,//默认和fontSize一致
		radius:5
	}
}