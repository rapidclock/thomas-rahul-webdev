module.exports = function(app){
    var users = [
        {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder", email: "alice@gmail.com"},
        {_id: "100", username: "a", password: "a", firstName: "a", lastName: "a", email: "a@gmail.com"},
        {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley", email: "bob@regge.com"},
        {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia", email: "charles@bing.com"},
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi", email: "jose@neu.com"}
    ];

    // POST Calls.
    app.post('/api/user', createEntity);

    // GET Calls.
    app.get('/api/user', getUser);
    app.get('/api/user/:uid', getUserId);

    // PUT Calls.
    app.put('/api/user/:uid', updateDetails);

    // DELETE Calls.
    app.delete('/api/user/:uid', deleteFromSystem);


    function getUser(req, res) {
        var query = req.query;
        var user = null;
        if(query.username && query.password){
            user = findUserByCredentials(query.username, query.password);
        } else if(query.username){
            user = findUserByUsername(query.username);
        }
        res.send(user);
    }

    function getUserId(req, res){
        var params = req.params;
        var user = null;
        if(params.uid){
            user = findUserById(params.uid);
        }
        res.send(user);
    }

    function createEntity(req, res) {
        var user = req.body;
        var newUser = createUser(user);
        if(newUser){
            res.send(newUser);
        } else {
            // Internal Server Error.
            res.sendStatus(500);
        }
    }
    function updateDetails(req, res){
        var uid = req.params.uid;
        var user = req.body;
        updateUser(uid, user);
        res.send(user);
    }

    function deleteFromSystem(req, res){
        var uid = req.params.uid;
        var user = findUserById(uid);
        if(uid){
            deleteUser(uid);
            res.send(user);
        } else{
            // Precondition Failed. Precondition is that the user exists.
            res.sendStatus(412);
        }
    }

    /* Standard CRUD Functions */

    function getNextId() {
        return new Date().getTime();
    }

    function createUser(user) {
        var newUserId = getNextId();
        var newUser = {
            _id: newUserId,
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
        users.push(newUser);
        return newUser;
    }

    function findUserById(userId) {
        for (u in users){
            var user = users[u];
            if(parseInt(user._id) === parseInt(userId)){
                return user;
            }
        }
        return null;
    }

    function findUserByUsername(username) {
        for (u in users){
            var user = users[u];
            if(user.username === username){
                return user;
            }
        }
        return null;
    }

    function findUserByCredentials(username, password) {
        for (u in users){
            var user = users[u];
            if((user.username === username) && (user.password === password)){
                return user;
            }
        }
        return null;
    }

    function updateUser(userId, user) {
        var oldUser = findUserById(userId);
        var index = users.indexOf(oldUser);
        users[index].firstName = user.firstName;
        users[index].lastName = user.lastName;
        users[index].email = user.email;
    }

    function deleteUser(userId) {
        var oldUser = findUserById(userId);
        var index = users.indexOf(oldUser);
        users.splice(index, 1);
    }
};