import {h,Component,render}   from 'preact'
import cad from '../../src/index'
cad.Paper.prototype.createVirtualDOM = function(tagName,attributes,children){
	return h(tagName,attributes,children);
};

var root = document.querySelector("#root");
var Paper = cad.Paper;
var div = h("div",{},'test',h("h1",{},"h1h1"));
var paper = new Paper(div);
paper.append("h1",{},"test")
var svg = paper.append("svg",{})
paper.switchLayer(svg);
paper.rect(0,0,100,100)
paper.line(0,0,100,100)
paper.image("xxx",0,0,100,100)
paper.append("rect",{
	x:0,y:0,width:100,height:100,onclick:function(){
		alert(3)
	}
})
console.log(div)
render(div,root);

