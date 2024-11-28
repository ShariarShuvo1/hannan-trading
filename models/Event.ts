import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	tagline: {
		type: String,
		required: true,
	},
	banner: {
		type: String,
		required: true,
	},
	roi: {
		type: Number,
		required: true,
	},
	minimum_deposit: {
		type: Number,
		required: true,
	},
	maximum_deposit: {
		type: Number,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	start_date: {
		type: Date,
		required: true,
		default: Date.now,
	},
	is_active: {
		type: Boolean,
		default: true,
		required: true,
	},
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
