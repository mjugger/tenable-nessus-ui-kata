(function(){
	'use strict'
	function Constructor(perPageLimit,url,recordAmount){
		if(!(this instanceof Constructor) ){
			throw "pagination.js must be constructed with \"new\" keyword";
		}
		this.perPageLimit = perPageLimit;
		this.url = url;
		this.recordAmount = recordAmount;
		this.data;
	}

	Constructor.prototype.init = function(){
		var me = this;
		me.fetchData(function(data){
			me.data = data;
		});
	}

	Constructor.prototype.fetchData = function(callback){
		var xhr = new XMLHttpRequest();
		xhr.open('get', this.url+me.recordAmount, true);
		xhr.responseType = 'json';
		xhr.onload = function(){
			var status = xhr.status;
			if(status === 200){
				callback(xhr.response);
			}
		}
	}

	Constructor.prototype.isFloat = function(num){
		return Boolean(num%1);
	}

	Constructor.prototype.calculateTotalPages = function(dataArray){
		var recordCount = dataArray.length;
		var pageCount = recordCount / this.perPageLimit;
		if(this.isFloat(pageCount)){
			pageCount = parseInt(pageCount);
		}
		return pageCount;
	}

	Constructor.prototype.getPageData = function(pageToReturn){
		var startingIndex = (pageToReturn * this.perPageLimit);
		var endingIndex = startingIndex + this.perPageLimit;
		return this.data.slice(startingIndex,endingIndex);
	}

	if(!window.pagination){
		window.pagination = Constructor;
	}else if(window.pagination && window.pagination !== Constructor){
		throw "Cannot assign pagination.js Constructor to window.pagination. window.pagination is already assigned."
	}
})();