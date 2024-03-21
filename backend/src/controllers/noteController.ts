import express,{ Express,NextFunction,Request,RequestHandler,Response } from "express";

import NoteModel from "../models/noteSchema"
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefine } from "../utils/assertIsDefine";

interface CreateNoteBody{
  title?:string;
  text?:string;
}

export const getNotes =  async(req: Request, res: Response, next:NextFunction) => {

  const getAuthenticatedUserId = req.session.userId

    try {
      // throw createHttpError(401);

      // assertIsDefine(getAuthenticatedUserId)

        const notes= await NoteModel.find(
          {userId: getAuthenticatedUserId}
          ).exec();
        res.status(200).json(notes);


        console.log("getNotes from noteController")
        console.log("session is " , req.session.userId , notes)


    } catch (error) {
        next(error)
    }

  }

  export const getNote =  async(req: Request, res: Response, next:NextFunction) => {

    const noteId= req.params.noteId;
    const getAuthenticatedUserId = req.session.userId

    try {
      assertIsDefine(getAuthenticatedUserId)


      if(!mongoose.isValidObjectId(noteId)) throw createHttpError(400,"invalid note id")

      const newNotes =await NoteModel.findById(noteId).exec();
      if (!newNotes) throw createHttpError(404,"note not found");

      if (newNotes && newNotes.userId && !newNotes.userId.equals(getAuthenticatedUserId)) {
        throw createHttpError(401,"you cannot access this note")
      }

      res.status(201).json(newNotes)
    } catch (error) {
        next(error)
    }
  }

 

  export const createNotes =  async(req: Request, res: Response, next:NextFunction) => {

    const {title,text}:CreateNoteBody = req.body ;
    const getAuthenticatedUserId = req.session.userId

    try {
      assertIsDefine(getAuthenticatedUserId)


      if(!title) throw createHttpError(400,"note must have a title")
      const newNotes=await NoteModel.create({
    userId:getAuthenticatedUserId, //here we stored new property "userId" which has req.session.userId
        title,
        text,
      })
      res.status(201).json(newNotes)
    } catch (error) {
        next(error)
    }
  }

  export const updateNote:RequestHandler =  async(req , res , next) => {
    const noteId= req.params.noteId;
    const newTitle=req.body.title;
    const newText=req.body.text;

    const getAuthenticatedUserId = req.session.userId

    try {

      assertIsDefine(getAuthenticatedUserId)


      if(!mongoose.isValidObjectId(noteId)) throw createHttpError(400,"invalid note id")
      if(!newTitle) throw createHttpError(400,"note must have a title")

      const note=await NoteModel.findById(noteId).exec();

      if (!note) throw createHttpError(404,"note not found");

      if (note && note.userId && !note.userId.equals(getAuthenticatedUserId)) {
        throw createHttpError(401,"you cannot access this note")
      }


      note.title= newTitle;
      note.text=newText;

      const updateNote=await note.save();
      res.status(201).json(updateNote)

    } catch (error) {
        next(error)
    }
  }

  export const deleteNote:RequestHandler = async (req,res,next)=> {

    const noteId= req.params.noteId

    const getAuthenticatedUserId = req.session.userId


    try {

      assertIsDefine(getAuthenticatedUserId)


      if(!mongoose.isValidObjectId(noteId)) throw createHttpError(400,"invalid note id")

      const note= await NoteModel.findById(noteId).exec();

      if(!note) throw createHttpError(404,"note not found")

      if (note && note.userId && !note.userId.equals(getAuthenticatedUserId)) {
        throw createHttpError(401,"you cannot access this note")
      }

      await note.deleteOne({_id:noteId});
      res.sendStatus(204);
      
    } catch (error) { 
      next(error)
    }
  }
