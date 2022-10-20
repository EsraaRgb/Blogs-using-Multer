import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import * as schemas from "./user.validation.js";
import {tokenAuth} from '../auth/auth.validation.js'
import * as controller from "./controller/user.js";
import {myMulter,HME} from '../../services/multer.js'
const router = Router();

router.use(auth())

router.use(validate(tokenAuth))

router.get("/",controller.getAllUsers);

router.patch("/profilepic",myMulter().single('image'),HME,controller.addProfilePic);

router.put("/coverpics",myMulter().array('images',3), HME,controller.addCoverPics);
router.put("/profile",validate(schemas.updateProfile),controller.updateProfile);

router.patch("/",controller.softDeleteProfile);


export default router;
