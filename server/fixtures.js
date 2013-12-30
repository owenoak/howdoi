
// Owen's account
if (!Meteor.users.findOne({_id:"owen"})) {
	Meteor.users.insert({
		"createdAt" : new Date(Date.parse("2013-12-30T00:07:01.246")),
		"_id" : "owen",
		"services" : {
			"password" : {
				"srp" : {
					"identity" : "2QjGZZAANpvEMMRHY",
					"salt" : "LKFGMpssqdJHEeGLX",
					"verifier" : "ed2ce8bb2d54baad88b8ce9d2039e785920b36c8d12297ef7c988874903060a255cf622fd661484746fdb806d913c637f15eef052c7c3dfcb70c60d52b6e86b43c9204b76cec4570cde9095df3a6cbf91db101f88fe3a4c7363528ea35fee2b4412e0290ea2248a99583d110e29ff25a5a3661370952d57a578e4cfaede8de28"
				}
			},
		},
		"emails" : [
			{
				"address" : "owenoak@gmail.com",
				"verified" : false
			}
		]
	})
}


// Victoria's account
if (!Meteor.users.findOne({_id:"victoria"})) {
	Meteor.users.insert({
		"createdAt" : new Date(Date.parse("2013-12-30T01:07:01.246")),
		"_id" : "victoria",
		"services" : {
			"password" : {
	// password: "victoria"
				"srp" : {
					"identity" : "brf9Zb67snLNsYhaN",
					"salt" : "2MHYzATrHq2AJp5Du",
					"verifier" : "7c06b25e58670fcebc27f0ab49a67a67174d27fc799d8581f7b4c2753112eed04cda353c01e74493af8db9fd3f09a58cc083b7af95cd024ba77bedf0b753ce7dab34f89434488fc9775aca153e66ae4353a7f99c9f9c386a381c0c529c5bd956b16ccf6e833e79b3f287373d951f0e5eaa6f010c5a42993290d4cc5bd9842a76"
				}
			},
		},
		"emails" : [
			{
				"address" : "victoria.vany@gmail.com",
				"verified" : false
			}
		]
	});
}


if (Questions.find().count() === 0) {
	Questions.insert({
		_id		: "chocoQuestion",
		userId	: "owen",
		question: "How do I make chocolate?",
		author	: "owenoak",
		tags	: "cooking chocolate"
	});

	Answers.insert({
		questionId	: "chocoQuestion",
		userId		: "victoria",
		author		: "victoria.vany",
		answer		: "First you find some oompa loompas..."
	});


	Questions.insert({
		_id		: "turkeyQuestion",
		question: "How do I roast a turkey with bacon?",
		userId: "victoria",
		author	: "victoria.vany",
		tags	: "cooking turkey holiday"
	});

	Answers.insert({
		questionId	: "turkeyQuestion",
		userId		: "owen",
		author		: "owenoak",
		answer		: "Take a turkey, wrap with bacon!"
	});

}
