const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: String,
    title: String,
    image: String,
    emiter: String,
    receptor: String,
    rating: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
