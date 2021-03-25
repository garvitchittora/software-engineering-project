const mongoose = require("mongoose");

const appealSchema = new mongoose.Schema(
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
    appealFromId: {
      type: String,
      ref: "Student",
      required: true,
    },
    appealToId: {
      type: String,
      required: true,
      refPath: "onModel",
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Group", "Authority"],
    },
  },
  { _id: false }
);

appealSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Appeal = mongoose.model("Appeal", appealSchema);
module.exports = Appeal;
