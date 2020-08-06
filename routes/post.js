import express from "express";
import { requireLogin } from "../collections/auth.js";
import { createpost,allpost,mypost } from "../collections/post.js";

const router = express.Router();

router.get("/allpost",requireLogin, allpost)
router.get("/mypost",requireLogin, mypost)
router.post("/createpost", requireLogin, createpost );

export default router;
