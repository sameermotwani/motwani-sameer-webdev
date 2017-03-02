/**
 * Created by Vardhman on 2/26/2017.
 */

(function () {
    angular
        .module('wbdvDirectives',[])
        .directive('wbdvSortable', sortablefn)
        .directive('wbdvUpload', fileUpload);

    function sortablefn() {
        function linkFunc(scope, element, attributes) {
            startIndex = -1;
            endIndex = -1;
            element.sortable({
                axis: 'y',
                start: function(event,elem){
                    startIndex = elem.item.index();
                },
                stop: function(event,elem){
                    endIndex = elem.item.index();
                    scope.updateOrder({startIndex :startIndex, endIndex: endIndex});
                }
            });
        }
        return {
            link: linkFunc,
            scope : {
                updateOrder : "&"
            }
        };
    }

    function fileUpload($parse) {
        function linkFunc(scope, element, attributes) {
            var model = $parse(attributes.wbdvUpload);
            var modelSetter = model.assign;

            element.bind('change',function(){
                console.log(element[0].files[0]);
                //$parse(attributes.jgaUpload)
                //   .assign($scope,element[0].files[0]);
                scope.$apply(function () {
                    modelSetter(scope,element[0].files[0]);
                });
            });
        }
        return {
            restrict: 'A',
            link: linkFunc
        };
    }
})();
