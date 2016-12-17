module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var chatSchema = new Schema({
        users: [{type: Schema.Types.ObjectId, ref: 'Person'}],
        messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
        chatType: {type: String, enum: ['SINGLE', 'GROUP'], default: 'SINGLE'},
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }, {collection: 'chat'});

    return chatSchema;
};