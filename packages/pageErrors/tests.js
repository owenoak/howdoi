TinyTest.add("Error collection works", function(test) {
	// start with 0 errors
	test.equal(PageErrors.collection.find({}).count(), 0);

	// raise an error and make sure we got it
	PageErrors.show("Yoooooo hoooooo!");
	test.equal(PageErrors.collection.find({}).count(), 1);

	// remove everything
	PageErrors.collection.remove({});

});

TinyTest.addAsync("Error template works", function(test) {
	// raise an error and make sure we got it
	PageErrors.show("Yoooooo hoooooo!");
	test.equal(PageErrors.collection.find({{seen:false}}).count(), 1);

	// render the template
	OnscreenDiv(Spark.render(function() {
		return Template.pageErrors();
	}));

	// wait a few milliseconds
	Meteor.setTimeout(function() {
		// make sure everything has been seen
		test.equal(PageErrors.collection.find({seen:false}).count(), 0);
		// but there's still one error there
		test.equal(PageErrors.collection.find({}).count(), 1);

		// clear all seen errors
		PageErrors.clearSeen();
		// make sure there are no seen errors still
		test.equal(PageErrors.collection.find({seen:true}).count(), 0);

		// yield to next test
		done();
	}, 500);
});