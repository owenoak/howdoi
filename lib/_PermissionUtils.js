////////////
//
//	PermissionUtils helper functions
//
////////////


PermissionUtils = {

	// Only allow something if we're logged in
	isLoggedIn : function (userId, doc) {
		return !!userId;
	},

	// Only allow something if this is my document.
	// TODO: admin rights...
	isMine : function (userId, doc) {
		return doc && userId === doc.userId;
	},


	// Only allow if this is my document,
	//	or the question in reference mine.
	// NOTE: assumes `doc.questionId` will point to the id of a question.
	isMineOrQuestionIsMine : function(userId, doc) {
		if (PermissionUtils.isMine(userId, doc)) return true;
		if (doc && doc.questionId) {
			var question = Questions.find(doc.questionId);
			if (question && question.userId === userId) return true;
		}
		return false;
	}

}



