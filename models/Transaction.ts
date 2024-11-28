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
	agent_bank_info: {
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
		routing_number: {
			type: String,
			required: false,
		},
	},
	admin_bank_info: {
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
		routing_number: {
			type: String,
			required: false,
		},
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
	investors: [
		{
			name: {
				type: String,
				required: false,
			},
			nid: {
				type: String,
				required: true,
			},
			nominee_name: {
				type: String,
				required: true,
			},
			nominee_nid: {
				type: String,
				required: true,
			},
			payment_method: {
				type: String,
				required: true,
			},
			date: {
				type: Date,
				required: true,
			},
			amount: {
				type: Number,
				required: true,
			},
			percentage: {
				type: Number,
				required: true,
			},
		},
	],
	is_approved: {
		type: Boolean,
		default: false,
		required: true,
	},
});

const Transaction =
	mongoose.models.Transaction ||
	mongoose.model("Transaction", TransactionSchema);

export default Transaction;
