import express from "express";
import { requireLogin } from "../collections/auth.js";
import { createpost } from "../collections/post.js";

const router = express.Router();

router.post("/createpost", requireLogin, createpost );

export default router;
