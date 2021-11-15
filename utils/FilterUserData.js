module.exports = (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
        work: user.job,
        city: user.city,
        hobbies: user.hobbies,
        phone: user.contact,
        relationship: user.relationship,
        active: user.active,
        about: user.about,
        neighborhood : user.neighborhood,
        friends: user.friends.map((friend) => ({
            id: friend._id,
            name: friend.name
        })),
    }
}
