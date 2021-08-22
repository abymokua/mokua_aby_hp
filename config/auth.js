module.exports = {
    ensureAuth: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      } else {
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
      }
    },
    ensureUser: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}

