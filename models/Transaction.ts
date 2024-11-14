import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	bank_account_number: {
		type: String,
		required: true,
	},
	routing_number: {
		type: String,
		required: true,
	},
	bank_account_holder_name: {
		type: String,
		required: true,
	},
	bank_name: {
		type: String,
		required: true,
	},
	bank_district: {
		type: String,
		required: true,
	},
	bank_branch: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	picture: {
		type: String,
		required: false,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

const Transaction =
	mongoose.models.Transaction ||
	mongoose.model("Transaction", TransactionSchema);

export default Transaction;
