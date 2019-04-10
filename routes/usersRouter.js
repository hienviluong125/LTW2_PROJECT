const router = require('express').Router();
const usersService = require('./../services/usersService');

router.get('/register', getAllUsers);
// router.get('/register',getAllUsers);
// router.get('/register',getAllUsers);
// router.get('/register',getAllUsers);
// router.get('/register',getAllUsers);
// router.get('/register',getAllUsers);

// router.post('/register', (req, res, next) => {
//     let { username, password } = req.body;
//     res.send({ status: 200, username, password, msg: 'regsiter account' });
// });

function getAllUsers(req, res, next) {
    usersService.getAllUsers()
        .then(result => {
            // res.render('users/register', { users: result });
            res.status(200).json({ users: result });
        })
        .catch(err => res.status(500).json({ err }));
}


module.exports = router;