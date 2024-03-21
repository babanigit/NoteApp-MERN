


import express,{Express} from "express";

import * as NotesController from "../controllers/noteController"
const router=express.Router()


router.route("/").get(NotesController.getNotes).post(NotesController.createNotes);
router.route("/:noteId").get(NotesController.getNote).patch(NotesController.updateNote).delete(NotesController.deleteNote);


export default router;