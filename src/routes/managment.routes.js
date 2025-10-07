import { Router } from "express";

const router = Router();
import *as managmentCtrl from '../controller/managment.controller'
import {authJwt} from '../middlewares'
import managment from "../models/managment";



router.post('/',[authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.createManagment);
router.get('/', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.getAllManagments)
router.get('/checkManagmentToday',[authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.checkManagmentToday)
router.get('/checkManagmentActive', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.checkManagmentActive)
router.get('/:id', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.getManagmentById)
router.delete('/:id', [authJwt.verifyToken,authJwt.isAdminOrModerator], managmentCtrl.deleteManagment)


export default router  