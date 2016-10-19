(function(){
	'use strict'
	function Constructor(perPageLimit,url,recordAmount,pageSelectionID,injectionContainerID){
		if(!(this instanceof Constructor) ){
			throw "pagination.js must be constructed with \"new\" keyword";
		}
		this.perPageLimit = perPageLimit;
		this.url = url;
		this.recordAmount = recordAmount;
		this.pageSelector = document.querySelector(pageSelectionID);
		this.injectionContainer = document.querySelector(injectionContainerID);
		this.pageCount = null;
		this.data = null;
	}

	Constructor.prototype.create = function(){
		var me = this;
		me.fetchData(function(data){
			me.data = data.configurations;
			me.pageCount = me.calculateTotalPages(me.data);
			me.setUpPageSelector();
			me.setUpPageContent(0);
			console.log('data: ',me.data,' pagecount: ',me.pageCount);
		});
	}

	Constructor.prototype.setUpPageSelector = function(){
		var me = this;
		if(this.pageSelector){
			var pageNumbers = this.createPageSelections(this.pageCount);
			this.pageSelector.appendChild(pageNumbers);
			this.pageSelector.addEventListener('change',function(){
				me.setUpPageContent(parseInt(this.selectedIndex));
			});
		}
	}

	Constructor.prototype.setUpPageContent = function(pageNumber){
		if(this.injectionContainer.hasChildNodes){
			this.removePageContent();
		}
		this.addPageContent(pageNumber);
	}

	Constructor.prototype.removePageContent = function(){
		while(this.injectionContainer.hasChildNodes()){
			this.injectionContainer.removeChild(this.injectionContainer.lastChild);
		}
	}

	Constructor.prototype.addPageContent = function(pageNumber){
		var pageData = this.getPageData(pageNumber);
		this.injectionContainer.appendChild(this.createPageElements(pageData));
	}

	Constructor.prototype.fetchData = function(callback){
		var xhr = new XMLHttpRequest();
		xhr.open('get', this.url+this.recordAmount, true);
		xhr.responseType = 'json';
		xhr.onload = function(){
			var status = xhr.status;
			if(status === 200){
				callback(xhr.response);
			}
		}
		xhr.send();
	}

	Constructor.prototype.isFloat = function(num){
		return Boolean(num%1);
	}

	Constructor.prototype.isOdd = function(number){
		return Boolean(number%2);
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

	Constructor.prototype.createPageSelections = function(numberOfPages){
		var docFrag = document.createDocumentFragment();
		var selectEl;
		numberOfPages = this.isOdd(numberOfPages) ? numberOfPages+1 : numberOfPages;
		for (var i = 0; i < numberOfPages; i++) {
			selectEl = document.createElement('option');
			selectEl.textContent = 'page: '+(i+1);
			docFrag.appendChild(selectEl);
		};
		return docFrag;
	}

	Constructor.prototype.createPageElements = function(pageData){
		var docFrag = document.createDocumentFragment();
		var container;
		var title;
		var h2;
		var cardBody;
		for (var i = 0; i < pageData.length; i++) {
			container = document.createElement('div');
			title = document.createElement('div');
			h2 = document.createElement('h2');
			cardBody = document.createElement('div');
			container.className = 'mdl-card mdl-shadow--4dp custom-card-styles fadeIn';
			title.className = 'mdl-card__title';
			h2.className = 'mdl-card__title-text';
			cardBody.className = 'mdl-card__supporting-text';
			h2.textContent = pageData[i].name;
			cardBody.innerHTML = pageData[i].hostname+'<br/>'+pageData[i].port+'<br/>'+pageData[i].username;
			title.appendChild(h2);
			container.appendChild(title);
			container.appendChild(cardBody);
			docFrag.appendChild(container);
		};
		return docFrag;
	}

	if(!window.pagination){
		window.pagination = Constructor;
	}else if(window.pagination && window.pagination !== Constructor){
		throw "Cannot assign pagination.js Constructor to window.pagination. window.pagination is already assigned."
	}
})();