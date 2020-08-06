import mongoose from "mongoose";

const Post = mongoose.model("post");

export const createpost = (req, res) => {
  const { title, body } = req.body;
  if (!title || !body)
    return res.status(422).json({
      message: "Please input all fields",
      status: "Unprocessable Entity",
    });
  req.userData.password = undefined;
  req.userData.__v = undefined;
  Post.create({
    title,
    body,
    currentUser: req.userData,
  })
    .then((data) => res.json(data))
    .catch((err) => res.send(`Error while creating post : ${err}`));
};

export const allpost = (req,res) => {
  Post.find()
  .populate('currentUser','name _id')
  .then(posts=>res.json(posts))
  .catch(err=>res.send('Error while getting record'))
}

export const mypost = (req,res) => {
  Post.find({currentUser:req.userData._id})
  .populate('currentUser','_id name')
  .then(myposts => res.json(myposts))
  .catch(err => res.send('Error while getting record'))
}