import BlogModel from "../../../DB/models/Blog.js";
import UserModel from "../../../DB/models/User.js";
import cloudinary from "../../../services/cloudinary.js";
export const addBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const blog = await new BlogModel({
      title,
      description,
      createdBy: req.user._id,
    }).save();
    await UserModel.findByIdAndUpdate(req.user._id, {
      $addToSet: { blogs: blog._id },
    });
    res.status(201).json({ message: "done", blog });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const addPics = async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).json({ message: "please upload an image" });
    } else {
      const { id } = req.params;
      req.files.forEach(async (file) => {
        const image = await cloudinary.uploader.upload(file.path, {
          folder: "blog/Pictures",
        });
        await BlogModel.updateOne(
          { _id: id, createdBy: req.user._id },
          { $addToSet: { pictures: image.secure_url } }
        );
      });
      res.status(201).json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const addVideo = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "please upload a video" });
    } else {
      console.log("endpoind");
      const { id } = req.params;
      console.log(req.file.path);
      const video = await cloudinary.uploader
        .upload(req.file.path, {
          resource_type: "video",
          folder: "blog/videos",
        })
        .then(async(result) => {
          const blog = await BlogModel.findOneAndUpdate(
            { _id: id, createdBy: req.user._id },
            { video: result.secure_url }
          );
          res.status(201).json({ message: "Done",blog });
        });

    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find({}).populate([
      {
        path: "createdBy",
        match: { isDeleted: false },
      },
    ]);
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BlogModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: { $ne: req.user._id },
        likes: { $nin: req.user._id },
      },
      {
        $push: { likes: req.user._id },
        $pull: { unlikes: req.user._id },
        $inc:{totalCount:1}
      },{new:true}
    );
    if (result) {
      res.status(201).json(result);
    } else {
      res.status(400).json({
        message: "Wrong Id or you are not allowed to like the product",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const unlikeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BlogModel.findOneAndUpdate(
      {
        _id: id,
        likes: { $in: req.user._id },
      },
      {
        $pull: { likes: req.user._id },
        $push: { unlikes: req.user._id },
        $inc:{totalCount:-1}

      },{new:true}
    );
    if (result) {
      res.status(202).json(result);
    } else {
      res.status(400).json({
        message: "Wrong Id or you are not allowed to unlike the product",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
