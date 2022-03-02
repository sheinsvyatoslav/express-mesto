const router = require('express').Router();
const {
  getUsers, getUserById, getUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const { vaidateUpdateUser, vaidateUpdateAvatar, validateUserId } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', vaidateUpdateUser, updateUserInfo);
router.patch('/me/avatar', vaidateUpdateAvatar, updateUserAvatar);
router.get('/:userId', validateUserId, getUserById);

module.exports = router;
