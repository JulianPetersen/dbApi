import { Router } from "express";

const router = Router();
import *as cashMovementCtrl from '../controller/cashMovement.controller'
import {authJwt} from '../middlewares'



router.post('/',[authJwt.verifyToken,authJwt.isAdminOrModerator], cashMovementCtrl.createCashMovement);
router.get('/', [authJwt.verifyToken,authJwt.isAdminOrModerator], cashMovementCtrl.getTodayCashMovements)

// router.get('/:id', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.getManagmentById)
// router.delete('/:id', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.deleteManagment)
// router.put('/:id',[authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.closeManagment)

export default router  