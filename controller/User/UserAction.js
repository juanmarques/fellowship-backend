const User = require('../../model/User')
const FriendRequest = require('../../model/FriendRequest')
const FilterUserData = require('../../utils/FilterUserData')
const Notification = require('../../model/Notification')
const CreateNotification = require('../../utils/CreateNotification')
const upload = require("../../middleware/uploadImage");
const dbConfig = require("../../config");
const mongoose = require("mongoose");

exports.sendFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        if (req.userId === req.params.userId) {
            return res
                .status(400)
                .json({error: 'You cannot send friend request to yourself'})
        }

        if (user.friends.includes(req.userId)) {
            return res.status(400).json({error: 'Already Friends'})
        }

        const friendRequest = await FriendRequest.findOne({
            sender: req.userId,
            receiver: req.params.userId,
        })

        if (friendRequest) {
            return res.status(400).json({error: 'Friend Request already send'})
        }

        const newFriendRequest = new FriendRequest({
            sender: req.userId,
            receiver: req.params.userId,
        })

        const save = await newFriendRequest.save()

        const friend = await FriendRequest.findById(save.id).populate('receiver')

        const chunkData = {
            id: friend.id,
            user: FilterUserData(friend.receiver),
        }

        res
            .status(200)
            .json({message: 'Friend Request Sended', friend: chunkData})

        const sender = await FriendRequest.findById(save.id).populate('sender')
        let notification = await CreateNotification({
            user: req.params.userId,
            body: `${sender.sender.name} has send you friend request`,
        })
        const senderData = {
            id: sender.id,
            user: FilterUserData(sender.sender),
        }

        if (user.socketId) {
            req.io
                .to(user.socketId)
                .emit('friend-request-status', {sender: senderData})
            req.io.to(user.socketId).emit('Notification', {data: notification})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}

exports.acceptFriendRequest = async (req, res) => {
    try {
        const friendsRequest = await FriendRequest.findById(req.params.requestId)
        if (!friendsRequest) {
            return res
                .status(404)
                .json({error: 'Request already accepted or not sended yet'})
        }

        const sender = await User.findById(friendsRequest.sender)
        if (sender.friends.includes(friendsRequest.receiver)) {
            return res.status(400).json({error: 'already in your friend lists'})
        }
        sender.friends.push(req.userId)
        await sender.save()

        const currentUser = await User.findById(req.userId)
        if (currentUser.friends.includes(friendsRequest.sender)) {
            return res.status(400).json({error: 'already  friend '})
        }
        currentUser.friends.push(friendsRequest.sender)
        await currentUser.save()

        const chunkData = FilterUserData(sender)

        await FriendRequest.deleteOne({_id: req.params.requestId})
        res
            .status(200)
            .json({message: 'Friend Request Accepted', user: chunkData})

        let notification = await CreateNotification({
            user: sender.id,
            body: `${currentUser.name} has accepted your friend request`,
        })
        if (sender.socketId) {
            let currentUserData = FilterUserData(currentUser)
            req.io.to(sender.socketId).emit('friend-request-accept-status', {
                user: currentUserData,
                request_id: req.params.requestId,
            })
            req.io.to(sender.socketId).emit('Notification', {data: notification})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}

exports.cancelSendedFriendRequest = async (req, res) => {
    try {
        const friendsRequest = await FriendRequest.findById(
            req.params.requestId,
        ).populate('receiver')
        if (!friendsRequest) {
            return res
                .status(404)
                .json({error: 'Request already cenceled or not sended yet'})
        }
        await FriendRequest.deleteOne({_id: req.params.requestId})

        res.status(200).json({message: 'Friend Request Canceled'})
        if (friendsRequest.receiver.socketId) {
            req.io
                .to(friendsRequest.receiver.socketId)
                .emit('sended-friend-request-cancel', {
                    requestId: req.params.requestId,
                })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}

exports.declineFriendRequest = async (req, res) => {
    try {
        const friendsRequest = await FriendRequest.findById(
            req.params.requestId,
        ).populate('sender')
        if (!friendsRequest) {
            return res
                .status(404)
                .json({error: 'Request already declined or not sended yet'})
        }
        await FriendRequest.deleteOne({_id: req.params.requestId})

        res.status(200).json({message: 'Friend Request Declined'})
        if (friendsRequest.sender.socketId) {
            req.io
                .to(friendsRequest.sender.socketId)
                .emit('received-friend-request-decline', {
                    requestId: req.params.requestId,
                })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}

exports.updateProfilePic = async (req, res) => {
    const {profile_url} = req.body
    try {
        const user = await User.findById(req.userId)
        user.profile_pic = profile_url
        await user.save()

        const getUser = await User.findById(req.userId).populate('friends')
        const userData = FilterUserData(getUser)

        userData.friends = getUser.friends.map((friend) => {
            return {
                ...FilterUserData(friend),
            }
        })
        res.status(200).json({message: 'profile image updated', user: userData})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const {job, city, hobbies, contact, relationship, birthday_date, about} = req.body

        if (job !== undefined) {
            user.job = job;
        }
        if (city !== undefined) {
            user.city = city;
        }
        if (hobbies !== undefined) {
            user.hobbies = hobbies;
        }
        if (contact !== undefined) {
            user.contact = contact;
        }
        if (relationship !== undefined) {
            user.relationship = relationship;
        }
        if (birthday_date !== undefined) {
            user.birthday_date = birthday_date;
        }
        if (about !== undefined) {
            user.about = about;
        }

        await user.save()
        res.status(200).json({message: 'Updated Successfully'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}

const isEmpty = ((value) => {
    return !value;
})

exports.clearNotification = async (req, res) => {
    try {
        await Notification.deleteMany({user: req.userId})
        res.status(200).json({message: 'Notification Cleared Successfully'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}

exports.uploadFiles = async (req, res) => {
    try {
        //await upload(req, res);
        await download(req, res)
        /*        return res.status(200).send({
                    message: "Files have been uploaded.",
                });*/
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload.",
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`,
        });
    }
};

const download = async (req, res) => {
    try {

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: dbConfig.imgBucket
        });

        let downloadStream = bucket.openDownloadStreamByName('k8s_UPDATES.txt');

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            console.log(err)
            return res.status(404).send({message: "Cannot download the Image!"});
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};