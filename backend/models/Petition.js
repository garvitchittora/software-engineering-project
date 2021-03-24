const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    petitionFromId: {
      type: String,
      ref: "Student",
      required: true,
    },
    petitionToId: {
      type: String,
      required: true,
      ref: "Authority",
    },
    signees: [String],
    dateTime: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const Petition = mongoose.model("Petition", petitionSchema);
module.exports = Petition;
