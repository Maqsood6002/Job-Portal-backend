import mongoose  from "mongoose";
import { Application } from "./application.model.js";

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    requirement:[{
        type: String
    }],
    salary:{
        type: Number,
        required:true
    },
    location:{
        type: String,
        required:true
    },
    jobType:{
        type: String,
        required:true
    },
    experience:{
        type: Number,
        required:true
    },
    position:{
        type: Number,
        required:true
    },
    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    application:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Application'
        }
    ]
},{timestamps:true});
export const Job = mongoose.model('Job',jobSchema);