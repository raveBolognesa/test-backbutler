const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    phone: String,
    card: String,
    rating: String,
    chats: Array,
    images: String,
    comments: String,
    description:String,
    imgProfile: String,
    buys:Array,
    sells:Array
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
