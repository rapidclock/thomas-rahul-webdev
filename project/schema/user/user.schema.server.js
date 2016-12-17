module.exports = function (mongoose) {
    // var websiteSchema = require("../website/website.schema.server.js")(mongoose);

    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        username: {type: String, required: true},
        password: {type: String},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true},
        type: {
            type: String,
            uppercase: true,
            enum: ['USER', 'ADMIN'],
            default: 'USER'
        },
        phone: {type: String},
        profilePic: {type: String, default: "./uploads/defaults/default_profile_pic.jpeg"},
        aboutMe: String,
        caption: {type: String, default: "Hi, I am using this amazing app"},
        chats: [{type: Schema.Types.ObjectId, ref: 'Chat'}],
        friends: [{type: Schema.Types.ObjectId, ref: 'Person'}],
        facebook: {
            id: String,
            token: String
        },
        google: {
            id: String,
            token: String
        },
        location : {
            lat: {type : Number, default : 10},
            lng: {type : Number, default : 10}
        },
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }, {collection: 'person'});

    return userSchema;
};