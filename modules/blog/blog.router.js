import { Router } from "express";
import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validation.js'
import {tokenAuth} from '../auth/auth.validation.js'
import * as schemas from './blog.valdation.js' 
import * as controller from './controller/blog.js'
import {myMulter,HME,validationTypes} from '../../services/multer.js'


const router = Router();
router.use(auth())
router.use(validate(tokenAuth))

router.get('/',controller.getAllBlogs)

router.post('/',validate(schemas.addblog),controller.addBlog)

router.put("/:id",validate(schemas.blogId),myMulter(validationTypes.image).array('image',3),HME,controller.addPics)

router.patch("/:id",validate(schemas.blogId),myMulter(validationTypes.video).single('video'),HME,controller.addVideo)

router.patch("/like/:id",validate(schemas.blogId),controller.likeBlog)

router.patch("/unlike/:id",validate(schemas.blogId),controller.unlikeBlog)

export default router;
