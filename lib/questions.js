////////////
//
//	Questions dataset
//
////////////


////////////
// Schema -- used by Collection2 & AutoForm
////////////
QuestionSchema = new SimpleSchema({
	// _id field.  Note we have this here so we can manually set ids for questions.
	_id : SchemaUtils._idField,

	// Creation date.
	created : SchemaUtils.creationField,

	// Mod date.
	modified : SchemaUtils.modifiedField,

	// Author of the question.
	userId : SchemaUtils.userIdField,

	// Denormalized author name (username or email prefix) .
	author : SchemaUtils.authorField,

	// Question text.
	question : {
		type 		: String,
		label 		: "Question",
		// guarantee the question is unique
		unique		: true
	},

	// Arbitrary tags for the question.
	// NOTE: these should be updatable by anyone.
	tags : SchemaUtils.tagsField
});


////////////
// Collection definition.
////////////
Questions = new Meteor.Collection2("questions", {
	schema : QuestionSchema
});

// permissions
Questions.allow({
	// Anyone who is logged in can insert.
	insert : PermissionUtils.isLoggedIn,

	// You can only update your own questions.
	update : PermissionUtils.isMine,

	// You can only delete your own questions.
	remove : PermissionUtils.isMine,
});


////////////
// Server-side stuff
////////////
if (Meteor.isServer) {
	// Publish entire "Questions" collection to the client w/no filter.
	Meteor.publish("questions", function() {
		return Questions.find();
	});
}


////////////
// Client-side stuff
////////////
if (Meteor.isClient) {
	// Subscribe to entire published "questions" publication.
// NOTE: moved into `client/router.js`
//	Meteor.subscribe("questions");

	// Hooks to translate to<->from an AutoForm
	QuestionFormHooks = {
		before : {
			remove : function(docId) {
				var question = Questions.findOne(docId);
				if (!confirm("Really delete question: \n\n   \""+question.question+"\"\n\n????")) return false;
			}
		},

		after : {
			// After insert, go to the page for this question.
			insert : function(error, newItemId, template) {
				console.warn("after insert: ", arguments);
				if (error) {
					console.error(error);
					return;
				}
				Router.go("question", {_id:newItemId});
			},

			// After insert, go to the page for this question.
			update : function(error, result, template) {
				console.warn("after update: ", arguments);
				if (error) {
					var message = error.reason;
					if (message === "Access denied") {
						if (Meteor.userId()) {
							message = "You can only edit your own questions.";
						} else {
							message = "Please log in first.";
						}
					}
					Errors.show(message);
					return;
				}
				// TODO: cleaner way to get this?
				var id = template.data._doc._id;
				Router.go("question", {_id:id});
			},

			// After delete, go to the questions list.
			remove : function(error, result, remplate) {
				console.warn("after remove: ", arguments);
				if (error) {
					var message = error.reason;
					if (message === "Access denied") {
						if (Meteor.userId()) {
							message = "You can only remove your own questions.";
						} else {
							message = "Please log in first.";
						}
					}
					Errors.show(message);
					return;
				}
				Router.go("questions");
			}
		},

		// Go to the appropriate place on successful submit.
		onSuccess : function(error, result, template) {
			console.warn("onSuccess", arguments);
		},

		// Convert document from mongo to go into the form.
		docToForm : function(doc) {
			console.warn("docToForm: ", doc);
			return doc;
		},

		// Convert to document from form.
		formToDoc : function(doc) {
			console.warn("formToDoc: ", doc);
			return doc;
		}
	};

	// create ask/edit forms so we can add hooks
	AskQuestion = new AutoForm(Questions);
	AskQuestion.hooks(QuestionFormHooks);

	EditQuestion = new AutoForm(Questions);
	EditQuestion.hooks(QuestionFormHooks);

	// Cancel functionality
	// TODO: build this in to the form package!  `onCancel`
	AskQuestion.cancel = EditQuestion.cancel = function(destination, which) {
		if (which) {
			Router.go(destination, which);
		} else {
			Router.go(destination);
		}
	}
}



////////////
// Template helpers
////////////
if (Meteor.isClient) {

	Template.showQuestions.helpers({
		questions : function() {
			// sort by creation date, newest first
			return Questions.find({}, {sort:{created:-1}});
		},

	});

	Template.questionItem.helpers({
		tagPills : function() {
			var tags = this.tags;
			if (!tags || tags.length === 0) return;
			if (typeof tags === "string") {
				tags = tags.trim().split(/\s+/);
			}
			var maxTagsToDisplay = 4;
			var tags = tags.map(function(tag, index) {
				return "<span class='tag" + (index >= maxTagsToDisplay ? " extra" : "")+ "'>"+tag+"</span>";
			})
			if (tags.length > maxTagsToDisplay) {
				tags.push("<span class='tag-more'></span>");
			}
			return tags.join(" ");;
		},

		isMyPost : function() {
			return this.userId === Meteor.userId();
		},

		date : function() {
			return moment(this.created).fromNow();
		}

	});

	Template.questionItem.events({
		"click .tag-more" : function(event) {
			var $tags = $(event.currentTarget).parent();
			$tags.toggleClass("hiding");
		}

	});

}