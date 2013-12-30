////////////
//
//	Errors dataset
//
//	NOTE: this is client-side only, and is used to display errors to the user.
//
////////////

PageErrors = {
	collection : new Meteor.Collection(null),

	// Show an error to the user.
	show : function(message) {
		PageErrors.collection.insert({message: message, seen:false});
	},

	// Clear all errors (eg: after user has seen them)
	clearSeen : function() {
		PageErrors.collection.remove({seen:true});
	}
};


// Make the list of errors available to the pageErrors template.
Template.pageErrors.helpers({
	errors : function() {
		return PageErrors.collection.find();
	}
});

// Shortly after rendering each error, mark it as "seen".
Template.pageError.rendered = function() {
	var error = this.data;
	Meteor.defer(function() {
		PageErrors.collection.update(error._id, {$set: {seen:true}});
	});
}