import express from 'express';
var router = express.Router();

// GET /user/login - Allows users to log into their account.
// POST /user/register - Allows users to create a new account.
// GET /user/:id - Allows users to see their information; what cards they have, their trade requests and their favorites list.
// POST /user/:id/cards - Allows users to sell cards that they have.
// POST /user/:id/favorites - Allows users to add cards to their favorites list.
// POST /user/trade - Allows users to send or edit trade requests to another user.


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/myIdentity', async (req, res) => {
  if(req.authContext?.isAuthenticated()) {
    const account = req.authContext?.getAccount();
    res.json({
      status: "loggedin",
      userInfo: {
          name: account.name,
          username: account.username}
    });
  } else res.json({status: "loggedout"});
})

export default router;
