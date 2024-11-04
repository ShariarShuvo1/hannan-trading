import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: false,
	},
	fathername: {
		type: String,
		required: false,
	},
	mothername: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: false,
	},
	phone: {
		type: String,
		required: false,
	},
	house_no: {
		type: String,
		required: false,
	},
	village: {
		type: String,
		required: false,
	},
	po: {
		type: String,
		required: false,
	},
	ps: {
		type: String,
		required: false,
	},
	district: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: false,
	},
	nid_number: {
		type: String,
		required: false,
	},
	bank_account_number: {
		type: String,
		required: false,
	},
	bank_account_holder_name: {
		type: String,
		required: false,
	},
	bank_name: {
		type: String,
		required: false,
	},
	bank_district: {
		type: String,
		required: false,
	},
	bank_branch: {
		type: String,
		required: false,
	},
	profile_picture: {
		type: String,
		required: false,
	},
	signature: {
		type: String,
		required: false,
	},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
