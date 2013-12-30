////////////
//
//	Answers dataset
//
////////////

////////////
// Schema -- used by Collection2 & AutoForm
////////////
AnswerSchema = new SimpleSchema({
	// Creation date.
	created : SchemaUtils.creationField,

	// Mod date.
	modified : SchemaUtils.modifiedField,

	// Author of the question.
	userId : SchemaUtils.userIdField,

	// Denormalized author name (username or email prefix) .
	author : SchemaUtils.authorField,

	// id of the question this answer pertains to.
	questionId : {
		type 		: String,
		label 		: "Question id",
		denyUpdate	: true,
	},

	// Answer text.
	answer : {
		type 		: String,
		label 		: "Answer"
	},

});


////////////
// Collection definition.
////////////
Answers = new Meteor.Collection2("answers", {
	schema : AnswerSchema
});

// permissions
Answers.allow({
	// Anyone who is logged in can insert.
	insert : PermissionUtils.isLoggedIn,

	// You can only update your own answers.
	update : PermissionUtils.isMine,

	// The question author can delete answers as well as the answer author.
	remove : PermissionUtils.isMineOrQuestionIsMine
});


////////////
// Server-side stuff
////////////
if (Meteor.isServer) {
	// Publish entire "Answers" collection to the client w/no filter.
	Meteor.publish("answers", function() {
		return Answers.find();
	});
}


////////////
// Client-side stuff
////////////
if (Meteor.isClient) {

	AddAnswer = new AutoForm(Answers);

};


////////////
// Template helpers
////////////
if (Meteor.isClient) {

	Template.showQuestion.helpers({
		answers : function() {
			return Answers.find({questionId:this._id});
		},
	});


	Template.questionItem.helpers({
		answerCount : function() {
			var count = Answers.find({questionId:this._id}).fetch().length;
			if (count === 1) return "1 answer"
			return count + " answers";
		},
	});


	Template.answerItem.helpers({
		date : function() {
			var date = (this.modified ? this.modified : this.created);
			return moment(date).fromNow();
		}

	});

}
