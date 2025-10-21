import { Router } from "express";

const router = Router();
import *as cashRegister from '../controller/cashRegister.controller'
import {authJwt} from '../middlewares'



router.get('/by-date',[authJwt.verifyToken,authJwt.isAdminOrModerator], cashRegister.getCashRegisterByDate);
// router.get('/', [authJwt.verifyToken,authJwt.isAdminOrModerator], cashMovementCtrl.getTodayCashMovements)
// router.get('/:id', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.getManagmentById)
// router.delete('/:id', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.deleteManagment)
// router.put('/:id',[authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.closeManagment)

export default router  