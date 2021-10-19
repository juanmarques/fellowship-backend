const { Schema, model } = require('mongoose')

const postSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        content: {
            type: String,
            trim: true,
        },
        body: {
            feelings: {
                type: String,
                trim: true,
            },
            with: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            at: {
                type: String,
                trim: true,
            },
            date: String,
        },
        image: String,
        privacy: {
            type: String,
            enum: ['Only me', 'Public'],
            default: 'Public',
        },
        post_type: {
            type: String,
            enum: ['noticias', 'estabelecimentos','seguranca','imoveis','eventos','doacoes','desaparecidos'],
            default: '',
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],

        hearts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true },
)

module.exports = model('Post', postSchema)