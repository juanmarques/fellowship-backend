const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        postal_code: {
            type: String,
            required: true,
        },
        neighborhood: {
            type: String,
            required: true,
        },
        birthday_date: {
            type: String,
            required: true,
        },
        profile_pic: {
            type: String,
            default: '',
        },
        active: {
            type: Boolean,
            default: false,
        },
        socketId: {
            type: String,
            default: '',
        },
        jwtToken: [String],

        job: {
            type: String,
            default: '',
            trim: true,
        },
        city: {
            type: String,
            default: '',
            trim: true,
        },
        hobbies: {
            type: String,
            trim: true,
        },
        contact: {
            type: String,
            trim: true,
        },
        relationship: {
            type: String,
            trim: true,
        },

        friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    },

    {timestamps: true},
)

UserSchema.index({name: 'text', email: 'text'})
module.exports = mongoose.model('User', UserSchema)