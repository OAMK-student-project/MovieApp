import { auth } from '../helpers/auth.js';
import { Router } from 'express';
import { getLists, addLists, removeLists } from '../controllers/favListController.js';

const router = Router();

router.get("/",auth,getLists);
router.post("/", auth,addLists);
router.delete("/removeList/:id", removeLists);

export default router;