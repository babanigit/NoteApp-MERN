import mongoose, { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique:true,
    },
    email: {
        type: String,
        require: true,
        unique:true,
        select:false
    },
    passwd: {
        type: String,
        require: true,
        select:false
    },

    // cPasswd:{
    //     type:String,
    //     require:true
    // },

}, {
    timestamps: true,
})

type user = InferSchemaType<typeof userSchema>;


const User = mongoose.model<user>("UserData", userSchema)
export default User;