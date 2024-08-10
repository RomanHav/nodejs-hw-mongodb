import { Router } from "express";
import contactRouter from "./contacts";
import authRouter from "./auth";

const router = Router();
router.use('/contacts', contactRouter);
router.use('/auth', authRouter);

export default router;
