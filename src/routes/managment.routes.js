import { Router } from "express";

const router = Router();
import *as managmentCtrl from '../controller/managment.controller'
import {authJwt} from '../middlewares'
import managment from "../models/managment";



router.post('/',[authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.createManagment);
router.get('/', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.getAllManagments)

router.get('/:id', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.getManagmentById)
router.delete('/:id', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.deleteManagment)
router.put('/:id',[authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.closeManagment)

export default router  