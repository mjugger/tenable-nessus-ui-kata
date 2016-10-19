describe('pagination',function(){
	var testPagination = new pagination(20);
	testPagination.data = new Array(103);

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