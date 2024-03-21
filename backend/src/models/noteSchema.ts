import mongoose, { InferSchemaType, Schema } from "mongoose";

const noteSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    text: {
        type: String,
    },
    // passwd:{
    //     type:String,
    //     require:true
    // },

    // cPasswd:{
    //     type:String,
    //     require:true
    // },

}, {
    timestamps: true,
})

type Note = InferSchemaType<typeof noteSchema>;


const User = mongoose.model<Note>("notesData", noteSchema);

export default User;