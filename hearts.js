Messages = new Mongo.Collection("messages");

if (Meteor.isClient) {
    Template.body.helpers({
        messages: function () {
            return Messages.find({}, {sort: {createdAt: 1}})
        }
    });

    Template.body.events({
        "submit .new-message": function (event) {
            // This function is called when the new message form is submitted

            var text = event.target.text.value;

            Messages.insert({
                text: text,
                createdAt: Date.now(),
                messageType: "message",
                hearts: 0
            });

            // Clear form
            event.target.text.value = "";

            // Prevent default form submit
            return false;
        },
        "submit .new-title": function (event) {
            // This function is called when the new message form is submitted

            var text = event.target.text.value;

            Messages.insert({
                text: text,
                createdAt: Date.now(),
                messageType: "title"
            });

            // Clear form
            event.target.text.value = "";

            // Prevent default form submit
            return false;
        }
    });

    Template.message.helpers({
        "displayHearts": function () {
            var hearts = "";
            for (var i = 0; i < this.hearts; i++) {
                hearts += "💜";
            }
            return hearts
        },
        "usesHearts": function () {
            return this.messageType === "message"
        }
    });

    Template.message.events({
        "click .heart": function () {
            Messages.update(this._id, {$set: {hearts: (this.hearts + 1)}});
        },
        "click .delete": function () {
            Messages.remove(this._id);
        },
        "click .move_up": function() {
            var messageToSwitch = Messages.findOne({createdAt: {$lt: this.createdAt}}, {sort: {createdAt: -1}});
            Messages.update(messageToSwitch._id, {$set: {createdAt: this.createdAt}});
            Messages.update(this._id, {$set: {createdAt: messageToSwitch.createdAt}});
        },
        "click .move_down": function() {
            var messageToSwitch = Messages.findOne({createdAt: {$gt: this.createdAt}}, {sort: {createdAt: 1}});
            Messages.update(messageToSwitch._id, {$set: {createdAt: this.createdAt}});
            Messages.update(this._id, {$set: {createdAt: messageToSwitch.createdAt}});
        }
    });
}