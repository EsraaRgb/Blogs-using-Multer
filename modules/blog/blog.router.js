import { Router } from "express";
import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validation.js'
import {tokenAuth} from '../auth/auth.validation.js'
import * as schemas from './blog.valdation.js' 
import * as controller from './controller/blog.js'
import {myMulter,HME} from '../../services/multer.js'


const router = Router();
router.use(auth())
router.use(validate(tokenAuth))

router.get('/',controller.getAllBlogs)

router.post('/',validate(schemas.addblog),controller.addBlog)

router.put("/:id",validate(schemas.blogId),myMulter().array('image',3),HME,controller.addPics)

router.patch("/:id",validate(schemas.blogId),myMulter('video').single('video'),HME,controller.addVideo)

router.patch("/like/:id",validate(schemas.blogId),controller.likeProduct)

router.patch("/unlike/:id",validate(schemas.blogId),controller.unLikeProduct)

export default router;
