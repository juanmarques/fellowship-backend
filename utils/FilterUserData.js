module.exports = (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
        job: user.job,
        city: user.city,
        hobbies: user.hobbies,
        phone: user.contact,
        relationship: user.relationship,
        active: user.active,
        about: user.about,
        friends: user.friends.map((friend) => ({
            id: friend._id,
            name: friend.name
        })),
    }
}
