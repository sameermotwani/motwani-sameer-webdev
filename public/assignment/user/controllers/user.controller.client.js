(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);
    function LoginController($location,$rootScope, $window, UserService) {
        var vm = this;
        vm.login = login;

        function init() {
        }

        init();

        function login(user) {
            console.log("@@");
            //console.log(username);
            console.log("@@");
            if(user)
            {
                UserService
                    .login(user)
                    .success(function (user) {
                        if (user) {
                            console.log("here");
                            $rootScope.currentUser = user;
                            $location.url("/user/" + user._id);
                        } else {
                            console.log("here2");
                            vm.error = "User not found";
                        }
                    })
                    .error(function (err) {
                        // console.log("In .error")
                        vm.error = "User not found";
                    });
            }
            else
            {
                vm.error = "Please enter the required fields";
            }
        }


    }

    function RegisterController($location, $window, UserService) {
        var vm = this;
        vm.register = register;

        function init() {
        }

        init();

        function register(user) {
            if (user.password != user.verifypwd) {
               // $window.alert("Passwords do not match");
                vm.error = "Passwords do not match";

            }
            else {
                UserService
                    .findUserByUsername(user.username)
                    .success(function (user) {
                        vm.message = "Username taken, please try another username";
                    })
                    .error(function (err) {
                        console.log("Test");
                        UserService
                            .register(user)
                            .success(function (newuser) {
                                vm.message = "Username created succesfully"
                                $location.url("/user/" + newuser._id);
                            });
                    });
            }
        }
    }

    function ProfileController($routeParams,$location,$rootScope, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.logout=logout;
        vm.userId = $routeParams["uid"];
        console.log()
        function init() {
            var promise = UserService.findUserById(vm.userId);
            promise.success(function (user) {
                vm.user = user;
            });
        }

        init();

        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    })
            }

            function updateUser(newUser) {
            UserService
                .updateUser(vm.userId, newUser)
                .success(function (user) {
                    if(user != null) {
                        vm.message = "User Successfully Updated!"
                    } else {
                        vm.error = "Unable to update user";
                    }
                });
        }
    }
})();