module.exports = function (app, model) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var googleConfig = {
        clientID: "174716504777-a1tpct0osfa412d1tlelt3o1p96uhm71.apps.googleusercontent.com",
        clientSecret: "CKnk99-tLgP5K8VeyfYj4rf7",
        callbackURL: "http://localhost:3000/rest/auth/google/callback"
    };
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    var bcrypt = require("bcrypt-nodejs");

    // Local Strategy
    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        model
            .userModel
            .findUserByGoogleId(profile.id)
            .then(function (user) {
                    if (user) {
                        return done(null, user);
                    }
                    else { //create a new user in db
                        var newUser = {
                            username: profile.emails[0].value.split('@')[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        model
                            .userModel
                            .createUser(newUser)
                            .then(function (user) {
                                    if (user) {
                                        return done(null, user);
                                    }
                                    else {
                                        return done(null, false);
                                    }
                                },
                                function (err) {
                                    if (err) {
                                        return done(err);
                                    }
                                });
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                });
    }

    // Serialize User
    passport.serializeUser(serializeUser);
    function serializeUser(user, done) {
        done(null, user);
    }

    // Deserialize User
    passport.deserializeUser(deserializeUser);
    function deserializeUser(user, done) {
        model
            .userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    /* REST API SECTION */
    // POST Calls.
    app.post('/rest/user', createUser);
    app.post('/rest/login', passport.authenticate('local'), login);
    app.post('/rest/logout', logout);
    app.post('/rest/register', register);
    app.post('/rest/friend', addFriend);
    // GET Calls.
    app.get('/rest/user', getUser);
    app.get('/rest/user/:uid', getUserById);
    app.get('/rest/users/uname', getUserByUserName);
    app.get('/rest/users/all', findAllUsers);
    app.get('/rest/loggedin', loggedin);
    // PUT Calls.
    app.put('/rest/user/:uid', updateUser);
    // DELETE Calls.
    app.delete('/rest/user/:uid', deleteUser);
    app.delete('/rest/friend', deleteFriend);

    app.get('/rest/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/rest/auth/google/callback',
        function (req, res, next) {
            passport.authenticate('google', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect('#/login');
                }
                var redirectUrl = '/project/#/user/' + user._id;
                if (req.session.redirectUrl) {
                    redirectUrl = req.session.redirectUrl;
                    req.session.redirectUrl = null;
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                });
                res.redirect(redirectUrl);
            })(req, res, next);
        });


    /* Function Definitions */
    // Passport Section
    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        model
            .userModel
            .createUser(user)
            .then(
                function (user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    // Rest of functions
    function createUser(req, res) {
        var user = req.body;
        model
            .userModel
            .createUser(user)
            .then(
                function (newUser) {
                    res.json(newUser);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function addFriend(req, res) {
        userIdA = req.query.userIdA;
        userIdB = req.query.userIdB;
        var userList = [];
        model
            .userModel
            .addFriend(userIdA, userIdB)
            .then(function (status) {
                    userList.push(userIdA, userIdB);
                    var newChat = {
                        users: userList
                    };
                    model
                        .chatModel
                        .createChat(newChat)
                        .then(function (chat) {
                                res.sendStatus(200);
                            }, function (error) {
                                res.sendStatus(400).send(error);
                            }
                        );
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function deleteFriend(req, res) {
        userIdA = req.query.userIdA;
        userIdB = req.query.userIdB;
        model
            .userModel
            .deleteFriend(userIdA, userIdB)
            .then(function (status) {
                    var userList = [userIdA, userIdB];
                    model
                        .chatModel
                        .findChatByUserIds(userList)
                        .then(function (chat) {
                                if (chat) {
                                    model
                                        .chatModel
                                        .deleteChat(chat._id)
                                        .then(function (success) {
                                                res.sendStatus(200);
                                            },
                                            function (error) {
                                                res.sendStatus(400).send(error);
                                            })
                                } else {
                                    res.sendStatus(200);
                                }
                            },
                            function (error) {
                                res.sendStatus(400).send(error);
                            });
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function getUser(req, res) {
        var query = req.query;
        if (query.username && query.password) {
            model
                .userModel
                .findUserByUsername(query.username)
                .then(
                    function (user) {
                        if (user) {
                            res.json(user);
                        } else {
                            user = null;
                            res.send(user);
                        }
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
        }
    }

    function getUserByUserName(req, res) {
        var query = req.query;
        // var user = null;
        if (query.username) {
            model
                .userModel
                .findUserByUsername(query.username)
                .then(
                    function (user) {
                        if (user) {
                            res.json(user);
                        } else {
                            user = null;
                            res.send(user);
                        }
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
        }
    }

    function getUserById(req, res) {
        var params = req.params;
        if (params.uid) {
            model
                .userModel
                .findUserById(params.uid)
                .then(
                    function (user) {
                        if (user) {
                            res.json(user);
                        } else {
                            user = null;
                            res.send(user);
                        }
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
        }
    }

    function findAllUsers(req, res) {
        model
            .userModel
            .findAllUsers()
            .then(function (users) {
                    res.json(users);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function updateUser(req, res) {
        var uid = req.params.uid;
        var user = req.body;
        model
            .userModel
            .updateUser(uid, user)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUser(req, res) {
        var uid = req.params.uid;
        if (uid) {
            model
                .userModel
                .deleteUser(uid)
                .then(
                    function (status) {
                        res.sendStatus(200);
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
        } else {
            // Precondition Failed. Precondition is that the user exists.
            res.sendStatus(412);
        }
    }


};