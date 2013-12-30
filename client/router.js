// Router setup
Router.configure({
	layoutTemplate 	: "pageLayout",
	loadingTemplate	: "loading",
	// show loadingTemplate while waiting for questions subscription
	waitOn : function(){
		return [Meteor.subscribe("questions"), Meteor.subscribe("answers")];
	}
});



// Route configuration
Router.map(function() {
	// page: list of questions
	this.route("showQuestions", {path:"/"});

	// page: individual question.
	//		 `_id` is the id of the question to show
	this.route("showQuestion", {
		path:"/question/:_id",
		data:function() { return Questions.findOne(this.params._id); }
	});

	// page: ask a question
	this.route("askQuestion", {
		path : "/ask"
	});

	// page: edit a question
	this.route("editQuestion", {
		path : "/edit/:_id",
		data : function(){
			var question = Questions.findOne(this.params._id);
			Template.edit.question = question;
			return question;
		}
	});

});

// Set up access controls.
// WHY IS THIS NOT DONE IN THE ROUTE ITSELF?
var pleaseLogIn = function() {
	// If no user defined
	if (!Meteor.user()) {
		// show loader if we're logging in
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		}
		// NO WAY JOSE!
		else {
			this.render("pleaseLogIn");
		}
		this.stop();
	}
}

// Require login for certain pages.
Router.before(pleaseLogIn, {only:["ask", "edit"]});

// clear errors after they've been seen once
Router.before(function(){ PageErrors.clearSeen() });