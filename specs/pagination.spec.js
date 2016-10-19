describe('pagination',function(){
	var testPagination = new pagination(20);
	testPagination.data = new Array(103);
	testPagination.data[0] = {
		name:'luke cage',
		hostname:'netflix.com',
		port:1234,
		username:'powermayne'
	}
	testPagination.data[1] = {
		name:'bruce wayne',
		hostname:'wayneenterprise.com',
		port:888,
		username:'the batmayne'
	}
	testPagination.data[2] = {
		name:'tony stark',
		hostname:'starkenterprise.com',
		port:888,
		username:'ironmyane'
	}
	testPagination.data[3] = {
		name:'Dr. Stephen Vincent Strange',
		hostname:'antimuggle.com',
		port:9999,
		username:'quack strange'
	}
	testPagination.data[4] = {
		name:'logan',
		hostname:'slapchop.com',
		port:33,
		username:'the wolverine'
	}

	describe('calculateTotalPages fn',function(){
		it('should calculate the total amount of pages',function(){
			expect(testPagination.calculateTotalPages(testPagination.data)).toBe(5);
		});
	});

	describe('getPageData fn',function(){
		it('should return an array that is a portion of the original array',function(){
			var page = testPagination.getPageData(5);
			expect(page.length).toBe(3);
		});

	});

	describe('getSearchData fn',function(){
		it('should return the record at the 3rd index when searching for name vincent',function(){
			var results = testPagination.getSearchData('vincent');
			console.log(results);
			expect(results[0].name).toBe(testPagination.data[3].name);
		});

		it('should return the records at index 1 and 2 when searching for port 888',function(){
			var results = testPagination.getSearchData(888);
			expect(results.length).toBe(2);
			expect(results[0].name).toBe('bruce wayne');
			expect(results[1].name).toBe('tony stark');
		});

		it('should return record at index 0 when searching for port 1234',function(){
			var results = testPagination.getSearchData(1234);
			expect(results[0].name).toBe(testPagination.data[0].name);
		});
	});

	describe('isFloat fn',function(){
		it('should return true if number is a floating point',function(){
			expect(testPagination.isFloat(10.3)).toBe(true);
		});

		it('should return false if number is an integer',function(){
			expect(testPagination.isFloat(10)).toBe(false);
		});
	});

	describe('isOdd fn',function(){
		it('should return true if number is odd',function(){
			expect(testPagination.isOdd(5)).toBe(true);
		});

		it('should return false if number is even',function(){
			expect(testPagination.isOdd(8)).toBe(false);
		});
	});

});