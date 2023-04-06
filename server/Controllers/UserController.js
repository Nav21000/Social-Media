// import { response } from "express";
import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

//get a user

export const getUser = async (req, res) => {
   const id = req.params.id;

   try {
    const user = await UserModel.findById(id);

    if(user){

        const {password, ...otherDetails} = user._doc;                //destructuring the user object to not send the password in the request

        res.status(200).json(otherDetails);
    }
    else{
        res.status(404).json("NO USER FOUND");
    }
   }catch(error){
         res.status(500).json(error);
   }

//    const user = await UserModel.findById(id);
}
// Get all users
export const getAllUsers = async (req, res) => {

    try {
      let users = await UserModel.find();
      users = users.map((user)=>{
        const {password, ...otherDetails} = user._doc
        return otherDetails
      })
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  

//update a user

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const {currentUserId,currentUserAdminStatus,password} = req.body;

    if(id===currentUserId || currentUserAdminStatus)
    {
        try{

            if(password){
                const salt = await bcrypt.genSalt(10);
                res.body.password= await bcrypt.hash(password,salt)
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true});
            res.status(200).json(user);
        }catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("AccessDenied");
    }
};


//Delete user

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const {currentUserId,currentUserAdminStatus} = req.body;

    if(id===currentUserId || currentUserAdminStatus)
    {
        try{
             await UserModel.findByIdAndDelete(id);
            res.status(200).json("Use deleted successfully");
        }catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("AccessDenied");
    }
}

//follow a user

export const followUser = async (req, res) => {
    const id = req.params.id;

    const {currentUserId} = req.body;
    {
        if(currentUserId===id)
        {
            res.status(403).json("AccessForbedien");
        }
        else{
            try{
                const followUser= await UserModel.findById(id);
                const followingUser= await UserModel.findById(currentUserId);
                if(!followUser.followers.includes(currentUserId)){
                    await followUser.updateOne({$push: {followers: currentUserId}});
                    await followingUser.updateOne({$push: {following: id}});
                    res.status(200).json("User followed!");
                }
                else{
                    res.status(403).json("User already followed!");
                }
            }catch(error){
                res.status(500).json(error);
        }
    }
}
};

//Unfollow a user

export const unFollowUser = async (req, res) => {
    const id = req.params.id;

    const {currentUserId} = req.body;
    {
        if(currentUserId===id)
        {
            res.status(403).json("AccessForbedien");
        }
        else{
            try{
                const followUser= await UserModel.findById(id);
                const followingUser= await UserModel.findById(currentUserId);
                if(followUser.followers.includes(currentUserId)){
                    await followUser.updateOne({$pull: {followers: currentUserId}});
                    await followingUser.updateOne({$pull: {following: id}});
                    res.status(200).json("User Unfollowed!");
                }
                else{
                    res.status(403).json("User is not followed by you! ");
                }
            }catch(error){
                res.status(500).json(error);
        }
    }
}
};