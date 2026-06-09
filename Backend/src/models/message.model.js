import mongoose ,{Schema} from "mongoose";

const messageSchema = new Schema({
    content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
   reply: {
    type: String,
    default: null,
  },
  threadToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
})

export const  Message = mongoose.model("Message",messageSchema);

