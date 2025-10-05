import { auth } from '../helpers/auth.js';
import { Router } from 'express';
import { getLists, addLists, removeLists, updateLists, shareList } from '../controllers/favListController.js';

const router = Router();

router.get("/",auth,getLists);
router.post("/", auth,addLists);
router.delete("/:id", auth,removeLists);
router.patch("/:id", auth, updateLists);
router.post("/:id/share", auth, shareList);

export default router;