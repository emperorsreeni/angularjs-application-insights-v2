'use strict';
app.controller('myPlacesController', function ($scope, placesDataService,$log, applicationInsightsService) {

    $scope.myPlaces = [];

    //paging
    $scope.totalRecordsCount = 0;
    $scope.pageSize = 10;
    $scope.currentPage = 1;

    init();

    function init() {
        var name = "my place";
        $log.info(name, "page loaded", { name: 'my places page' });
        applicationInsightsService.trackEvent({
            name: "PageLoaded",
            properties:
            {
                "sessionId": "sss-0004--5454--545454",
                "appId": "ddd-fff-ddd-ff-ddfdd-45454",
                "userId": "dddd-ddd-ddd-ddd",
                "timeStamp": new Date().toDateString(),
                "page": "My Place Page",
                "action": "page loaded"
            },
            measurements: {
                duration:345
            }
        });
        getUserPlaces();
    }

    function getUserPlaces() {

        var userInCtx = placesDataService.getUserInContext();

        if (userInCtx) {

            placesDataService.getUserPlaces(userInCtx, $scope.currentPage - 1, $scope.pageSize).then(function (results) {

                $scope.myPlaces = results.data;

                var paginationHeader = angular.fromJson(results.headers("x-pagination"));

                $scope.totalRecordsCount = paginationHeader.TotalCount;

            }, function (error) {
                alert(error.message);
            });
        }
        $log.info("places are loaded", { name: 'my places page' });
    }

    $scope.pageChanged = function (page) {

        $scope.currentPage = page;
        getUserPlaces();

    };

});