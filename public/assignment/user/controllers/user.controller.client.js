(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);
    function LoginController($location, $window, UserService) {
        var vm = this;
        vm.login = login;

        function init() {
        }

        init();

        function login(user) {
            var promise = UserService
                .findUserByCredentials(user.username, user.password);
            promise.success(function(user){
                if(user) {
                    $location.url("/user/"+user._id);
                } else {
                    vm.error = "User not found";
                }
            });
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
                $window.alert("two input password is not the same, Please check!");
            }
            UserService
                .findUserByUsername(user.username)
                .success(function(user){
                    vm.message = "Username taken, please try another username";
                })
                .error(function (err) {
                    UserService
                        .createUser(user)
                        .success(function (newuser) {
                            vm.message = "Username updated succesfully"
                            $location.url("/user/"+newuser._id);
                        });
                });
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.userId = $routeParams["uid"];
        console.log()
        function init() {
            var promise = UserService.findUserById(vm.userId);
            promise.success(function (user) {
                vm.user = user;
            });
        }

        init();

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