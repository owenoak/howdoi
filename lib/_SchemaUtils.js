////////////
//
//	Schema helper functions
//
////////////

SchemaUtils = {
	// Entire field spec for _id field.
	// Using this lets us manually set the _id (nice for fixtures)
	_idField : {
		type 		: String,
		label		: "Id",
		denyUpdate	: true,
		optional	: true
	},


	// Entire field spec for creation date.
	creationField : {
		type 		: Date,
		label		: "Created",
		denyUpdate	: true,
		autoValue	: function() {
			if (this.isInsert) {
				return new Date();
			} else if (this.isUpsert) {
				return {$setOnInsert: new Date};
			}
			// clear the value so we don't try to modify it
			else {
				this.unset();
			}
		}
	},

	// Entire field spec for modified date.
	modifiedField : {
		type 		: Date,
		label		: "Modified",
		optional	: true,
		denyInsert	: true,
		autoValue	: function() {
			if (this.isUpdate) {
				return new Date();
			}
		}
	},


	// Entire field spec for userId.
	userIdField : {
		type 		: String,
		label 		: "Author id",
		denyUpdate	: true,
		autoValue	: function() {
			if (this.isInsert) {
				if (this.value != null) return this.value;
				// default current userid if known
				var user = Meteor.user();
				if (user) return Meteor.user()._id;
			}
		}
	},


	// Entire field spec for denormalized "author" field for currently logged in user.
	authorField : {
		type 		: String,
		label 		: "Asked by",
		denyUpdate	: true,
		autoValue	: function() {
			if (this.isInsert) {
				if (this.value != null) return this.value;

				// default current user name if known
				var user = Meteor.user();
				var name;

				if (user) {
					// try for username
					name = user.username;
					// if not found, use first part of email
					if (!name && user.emails && user.emails.length) {
						name = user.emails[0].address.split("@")[0];
					}
				}
				// default name to "Anonymous"
				if (!name) name = "Anonymous";
				return name;
			}
		}
	},

	tagsField : {
// TODO: make this an array
//		 having trouble getting AutoForm to work with this as an array,
//		 keeps inserting `tags.0`, `tags.1` instead of `tags`.
		type 		: String,
		label		: "Tags",
		optional	: true,
		autoValue	: function() {
			if (typeof this.value === "string") {
				var value = this.value.trim().split(/\s+/).join(" ");
				if (value.length) return value;
			}
			// if we get here, we either had no tags or an empty string
			// so unset so we'll clear the tags field from the data.
			this.unset();
		}
	},

};