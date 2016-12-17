module.exports = function (mongoose) {
    var userSchema = require('../../schema/user/user.schema.server')(mongoose);
    var userModel = mongoose.model('Person', userSchema);

    var api = {
        'createUser': createUser,
        'findUserById': findUserById,
        'findUserByUsername': findUserByUsername,
        'findUserByCredentials': findUserByCredentials,
        'findAllUsers': findAllUsers,
        'findUserByGoogleId': findUserByGoogleId,
        'removeChatFromUser': removeChatFromUser,
        'updateUser': updateUser,
        'addFriend': addFriend,
        'deleteFriend': deleteFriend,
        'deleteUser': deleteUser
    };

    return api;

    function createUser(user) {
        var newUser = {
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            chats: [],
            friends: []
        };
        if (user.google) {
            newUser.google = user.google;
        }
        return userModel.create(newUser);
    }

    function findUserById(userId) {
        return userModel.findById(userId);
    }

    function findUserByUsername(uname) {
        return userModel.findOne({username: uname})
    }

    function findUserByCredentials(uname, pswrd) {
        return userModel.findOne({
            username: uname,
            password: pswrd
        });
    }

    function findAllUsers() {
        return userModel.find();
    }

    function findUserByGoogleId(googleId) {
        return userModel.findOne({'google.id': googleId});
    }

    function addFriend(userIdA, userIdB) {
        return userModel
            .findById(userIdA)
            .then(
                function (user) {
                    user.friends.push(userIdB);
                    user.save();
                    return userModel
                        .findById(userIdB)
                        .then(
                            function (user) {
                                user.friends.push(userIdA);
                                user.save();
                                return new Promise(function (resolve, reject) {
                                    resolve(200);
                                });
                            },
                            function (error) {
                                console.log(error);
                                return new Promise(function (resolve, reject) {
                                    reject(error);
                                });
                            }
                        );
                },
                function (error) {
                    console.log(error);
                    return new Promise(function (resolve, reject) {
                        reject(error);
                    });
                }
            );
    }

    function deleteFriend(userIdA, userIdB) {
        return userModel
            .findById(userIdA)
            .then(
                function (user) {
                    user.friends.pull(userIdB);
                    user.save();
                    return userModel
                        .findById(userIdB)
                        .then(
                            function (user) {
                                user.friends.pull(userIdA);
                                user.save();
                                return new Promise(function (resolve, reject) {
                                    resolve(200);
                                });
                            },
                            function (error) {
                                console.log(error);
                                return new Promise(function (resolve, reject) {
                                    reject(error);
                                });
                            }
                        );
                },
                function (error) {
                    console.log(error);
                    return new Promise(function (resolve, reject) {
                        reject(error);
                    });
                }
            );

    }

    function updateUser(userId, user) {
        var userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        };
        if (user.chats !== null && user.chats !== undefined) {
            userData.chats = user.chats;
        }
        if (user.profilePic !== "" && user.profilePic !== null && user.profilePic !== undefined) {
            userData.profilePic = user.profilePic;
        }
        if (user.aboutMe !== null && user.aboutMe !== undefined) {
            userData.aboutMe = user.aboutMe;
        }
        if (user.caption !== null && user.caption !== undefined) {
            userData.caption = user.caption;
        }
        if (user.location !== null && user.location !== undefined) {
            userData.location = {
                lat : user.location.lat,
                lng : user.location.lng
            };
        }
        return userModel.update({_id: userId}, userData);
    }

    function deleteUser(userId) {
        return userModel.remove({
            _id: userId
        });
    }

    function removeChatFromUser(userId, chatId) {
        userModel
            .findById(userId)
            .then(
                function (user) {
                    user.chats.pull(chatId);
                    user.save();
                },
                function (error) {
                    console.log(error);
                }
            );
    }
};