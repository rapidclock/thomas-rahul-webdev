(function () {
    angular
        .module("WebMessenger")
        .controller("MessageController", MessageController)
        .controller("ChatController", ChatController);

    function MessageController($timeout, $rootScope, $routeParams, $mdToast, $mdDialog, $mdSidenav, $location, UserService, ChatService, MessageService) {
        var vm = this;
        vm.sendMessage = sendMessage;
        // vm.message = "HappyFeet";
        vm.messages = [];
        vm.userId = $routeParams.uid;
        vm.chatId = $routeParams.cid;
        initialize();

        function initialize() {
            var promise = UserService.findUserById(vm.userId);
            promise
                .success(function (user) {
                    vm.user = user;
                    getChat();
                })
                .error(function () {
                    console.log("ChatList - User Find Error");
                });
        }

        function getChat() {
            if (vm.chatId) {
                var promise = ChatService.findChatById(vm.chatId);
                promise
                    .success(function (chat) {
                        vm.chat = chat;
                        var chatRecord = {
                            _id: chat._id
                        };
                        var usrs = chat.users;
                        for (j = 0; j < usrs.length; j++) {
                            if (usrs[j] === vm.uid) {
                                usrs.splice(j, 1);
                            }
                        }
                        var userToPromise = UserService.findUserById(usrs[0]);
                        userToPromise
                            .success(function (user) {
                                chatRecord.userTo = user;
                                vm.currentChatRoom = chatRecord;
                                refreshMessages();
                            })
                            .error(function (error) {
                                console.log(error);
                            });
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
        }

        function refreshMessages() {
            var messages = [];
            for (var i = 0; i < vm.chat.messages.length; i++) {
                var promise = MessageService.findMessageById(vm.chat.messages[i]);
                promise
                    .success(function (message) {
                        var msg = {
                            text: message.content,
                            time: message.dateCreated
                        };
                        if (message.userFrom === vm.userId) {
                            msg.own = 'their';
                        } else {
                            msg.own = 'mine';
                        }
                        messages.push(msg);
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
            messages.sort(function (a, b) {
                var aTime = a.time;
                var bTime = b.time;
                console.log(a.time);
                console.log(b.time);
                if (aTime < bTime) {
                    return -1;
                }
                if (aTime > bTime) {
                    return 1;
                }
                return 0;
            });
            vm.messages = messages;
        }

        function sendMessage() {
            if (vm.chatId) {
                var message = {
                    _chat: vm.chatId,
                    userFrom: vm.userId,
                    userTo: vm.currentChatRoom,
                    content: vm.content
                };
                var promise = MessageService.createMessage(message);
                promise
                    .success(function (message) {
                        vm.content = null;
                        getChat();
                    })
                    .error(function (error) {
                        console.log(error);
                    });

            } else {
                vm.content = null;
                showToast('error', 'Please select a Person to chat with, from top left menu.');
            }
        }

        function showToast(type, message) {
            if (type === 'error') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-error').textContent(message).position('top right'));
            }
            if (type === 'success') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-success').textContent(message).position('top right'));
            }
            if (type === 'neutral') {
                $mdToast.show($mdToast.simple().toastClass('md-toast-success').textContent(message).position('top right'));
            }
            else {
                $mdToast.show($mdToast.simple().textContent(message).position('top right'));
            }
        }

    }

    function ChatController($timeout, $rootScope, $routeParams, $mdToast, $mdDialog, $mdSidenav, $location, UserService, ChatService) {
        var vm = this;
        vm.chatRooms = [];
        vm.userId = $routeParams.uid;
        vm.chatId = $routeParams.cid;
        initialize();

        vm.toggleLeft = buildToggler('left');
        // vm.toggleRight = buildToggler('right');

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            }
        }


        function initialize() {
            var promise = UserService.findUserById(vm.userId);
            promise
                .success(function (user) {
                    vm.user = user;
                    vm.uid = user._id;
                    getChatRooms();
                })
                .error(function () {
                    console.log("ChatList - User Find Error");
                });
        }

        function getChatRooms() {
            var chatRooms = [];
            for (i = 0; i < vm.user.chats.length; i++) {
                var promise = ChatService.findChatById(vm.user.chats[i]);
                promise
                    .success(function (chat) {
                        if (chat) {
                            var room = {
                                _id: chat._id,
                                messages: chat.messages
                            };
                            var usrs = chat.users;
                            for (j = 0; j < usrs.length; j++) {
                                if (usrs[j] === vm.uid) {
                                    usrs.splice(j, 1);
                                }
                            }
                            var userTo = usrs[0];
                            var userPromise = UserService.findUserById(userTo);
                            userPromise
                                .success(function (user) {
                                    if (user) {
                                        room.userTo = user;
                                        chatRooms.push(room);
                                        if (vm.chatId) {
                                            if (vm.chatId === room._id) {
                                                vm.userTo = user;
                                            }
                                        }
                                    }
                                })
                                .error(function (error) {
                                    console.log(error);
                                });
                        }
                    })
                    .error(function (error) {
                        console.log(error);
                    });
                vm.chatRooms = chatRooms;
            }
        }


    }
})();