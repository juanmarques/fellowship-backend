const router = require('express').Router()
const {
  createComment,
  fetchComments,
  likeDislikeComment
} = require('../controller/Post/Comment')
const {
  fetchAllPosts,
  fetchPostById,
} = require('../controller/Post/FetchPost')
const {
  createPost,
  likeDislikePost,
} = require('../controller/Post/PostAction')
const authRequired = require('../middleware/auth')

router.post('/', authRequired, createPost)
router.get('/', authRequired, fetchAllPosts)
router.get('/:postId', authRequired, fetchPostById)

router.get('/comment/:commentId/like_dislike', authRequired, likeDislikeComment)

router.get('/:postId/like_dislike', authRequired, likeDislikePost)
router.get('/:postId/comment', authRequired, fetchComments)
router.post('/:postId/comment', authRequired, createComment)

module.exports = router
