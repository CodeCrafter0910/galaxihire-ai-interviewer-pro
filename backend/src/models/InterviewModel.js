const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidate: { type: String, required: true },
    score: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// ⛔ Prevent OverwriteModelError
module.exports = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
