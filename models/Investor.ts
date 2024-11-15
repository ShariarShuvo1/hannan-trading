import mongoose from "mongoose";

const InvestorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: false,
	},
	phone: {
		type: String,
		required: true,
	},
	deposits: [
		{
			amount: {
				type: Number,
				required: true,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	address: {
		type: String,
		required: false,
	},
	agent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

const Investor =
	mongoose.models.Investor || mongoose.model("Investor", InvestorSchema);

export default Investor;
