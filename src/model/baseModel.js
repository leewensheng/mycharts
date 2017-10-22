export default class BaseModel {
	normalLizeToArray(obj){
		return obj instanceof Array ? obj : [obj];
	}
	isPercent(str) {
		var regPercent = /^\d+(\.\d+)?%$/gi;
		return regPercent.test(str);
	}
	getUnitNumber(start,end) {
		if(start === end) {
			return 0;
		} else {
			return (end - start)/Math.abs(end - start);
		}
	}
	getPercentMayBeValue(percentMayBe,num) {
		if(typeof num === 'undefined') {
			return percentMayBe;
		}
		if(typeof percentMayBe === 'number') {
			return percentMayBe;
		}
		if(this.isPercent(percentMayBe)) {
			return parseInt(percentMayBe)/100*num;
		}
	}
}
