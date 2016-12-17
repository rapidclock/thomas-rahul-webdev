module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var messageSchema = new Schema({
        _chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
        userFrom: {type: Schema.Types.ObjectId, ref: 'Person'},
        userTo: {type: Schema.Types.ObjectId, ref: 'Person'},
        content: {type: String, required: true},
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }, {collection: 'message'});

    return messageSchema;
};