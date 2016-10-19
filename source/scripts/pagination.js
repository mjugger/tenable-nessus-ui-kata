(function(){
	'use strict'

	/**
	 * [Constructor: the contructor method for this app]
	 * @param {[Number]} perPageLimit         [the amount of records to show for each page]
	 * @param {[String]} url                  [the restful API url used to retrieved the data]
	 * @param {[Number]} recordAmount         [the amount of records to return]
	 * @param {[String]} pageSelectionID      [the element selector used to place the option elements]
	 * @param {[String]} injectionContainerID [the element selector used to place records in the DOM]
	 * @param {[String]} searchFormID         [the element selector of the form containing the seach field]
	 * @param {[String]} searchFieldID        [the element selector of the search field]
	 */
	function Constructor(perPageLimit,url,recordAmount,pageSelectionID,injectionContainerID,searchFormID,searchFieldID){
		if(!(this instanceof Constructor) ){
			throw "pagination.js must be constructed with \"new\" keyword";
		}
		this.perPageLimit = perPageLimit;
		this.url = url;
		this.recordAmount = recordAmount;
		this.pageSelector = document.querySelector(pageSelectionID);
		this.injectionContainer = document.querySelector(injectionContainerID);
		this.searchForm = document.querySelector(searchFormID);
		this.searchField = document.querySelector(searchFieldID);
		this.pageCount = null;
		this.data = null;
	}

	/**
	 * [create: initializes the app]
	 */
	Constructor.prototype.create = function(){
		var me = this;
		me.fetchData(function(data){
			me.data = data.configurations;
			me.pageCount = me.calculateTotalPages(me.data);
			me.setUpPageSelector();
			me.setUpSearch();
			me.setUpPageContent(0);
		});
	}

	/**
	 * [setUpSearch: initilizes the search feature]
	 */
	Constructor.prototype.setUpSearch = function(){
		if(this.searchForm && searchField){
			var me = this;
			this.searchForm.addEventListener('submit',function(e){
				e.preventDefault();
				var results = me.getSearchData(me.searchField.value);
				var DOMElements = me.createPageElements(results);
				me.removePageContent();
				me.addPageContent(DOMElements);
			});
		}
	}

	/**
	 * [setUpPageSelector: initializes the page selection feature]
	 */
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

	/**
	 * [setUpPageContent: swaps page content out for new conent]
	 * @param {[Number]} pageNumber [the total number of pages]
	 */
	Constructor.prototype.setUpPageContent = function(pageNumber){
		if(this.injectionContainer.hasChildNodes){
			this.removePageContent();
		}
		var pageData = this.getPageData(pageNumber);
		var DOMElements = this.createPageElements(pageData);
		this.addPageContent(DOMElements);
	}

	/**
	 * [removePageContent: removes all content from the injection container]
	 */
	Constructor.prototype.removePageContent = function(){
		while(this.injectionContainer.hasChildNodes()){
			this.injectionContainer.removeChild(this.injectionContainer.lastChild);
		}
	}

	/**
	 * [addPageContent: places content contained in a document fragment into the injection container]
	 * @param {[Array]} pageContent [an Array of object literals containing the page content]
	 */
	Constructor.prototype.addPageContent = function(pageContent){
		this.injectionContainer.appendChild(pageContent);
	}

	/**
	 * [fetchData: fetches the json data from the server's restful API]
	 * @param  {Function} callback [function to call when operation is successful]
	 */
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

	/**
	 * [isFloat: determains if a number is a floating point number]
	 * @param  {[Number]}  num [the number to check]
	 * @return {Boolean}     [true if the number is floating point and false if it is not]
	 */
	Constructor.prototype.isFloat = function(num){
		return Boolean(num%1);
	}

	/**
	 * [isOdd: determains if number is odd]
	 * @param  {[Number]}  number [the number to check]
	 * @return {Boolean}        [true if the number is odd and false if it is even]
	 */
	Constructor.prototype.isOdd = function(number){
		return Boolean(number%2);
	}

	/**
	 * [calculateTotalPages: calculates the total number of pages to generate based on the per page limit]
	 * @param  {[Array]} dataArray [the array of object literals to calculate]
	 * @return {[Number]}           [the total number of pages]
	 */
	Constructor.prototype.calculateTotalPages = function(dataArray){
		var recordCount = dataArray.length;
		var pageCount = recordCount / this.perPageLimit;
		if(this.isFloat(pageCount)){
			pageCount = parseInt(pageCount);
		}
		return pageCount;
	}

	/**
	 * [getPageData: copies a peice of the data array based on the page the sata belongs to]
	 * @param  {[Number]} pageToReturn [the page the data will live on]
	 * @return {[Array]}              [the copy of the data for the specified page]
	 */
	Constructor.prototype.getPageData = function(pageToReturn){
		var startingIndex = (pageToReturn * this.perPageLimit);
		var endingIndex = startingIndex + this.perPageLimit;
		return this.data.slice(startingIndex,endingIndex);
	}

	/**
	 * [getSearchData: serches the data array for objects matching the search criteria]
	 * @param  {[String]} searchTerm [the value to search for]
	 * @return {[Array]}            [an array containing the results of the search]
	 */
	Constructor.prototype.getSearchData = function(searchTerm){
		var results = [];
		var match;
		var searchRegEx = new RegExp(searchTerm,'gi');
		for (var i = 0; i < this.data.length; i++) {
			match = null;
			for(var key in this.data[i]){
				if( searchRegEx.test(this.data[i][key].toString()) ){
					match = this.data[i];
					break;
				}
			}
			if(match){
				results.push(match);
			}
		};
		return results;
	}

	/**
	 * [createPageSelections: creates the option elements for the page selection dropdown]
	 * @param  {[Number]} numberOfPages [the amount of option elements to create based on the number of pages]
	 * @return {[Object]}               [a DocumentFragment containing all the option elements]
	 */
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

	/**
	 * [createPageElements: creates an HTML structure for the page data]
	 * @param  {[Array]} pageData [the data used to create the HTML markup]
	 * @return {[Object]}          [a DocumentFragment containing all the card/div elements]
	 */
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