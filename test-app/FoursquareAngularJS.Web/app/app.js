
var app = angular.module('FoursquareApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'toaster', 'chieffancypants.loadingBar','ApplicationInsightsModule']);

app.config([
    'applicationInsightsServiceProvider', function (applicationInsightsServiceProvider) {
        applicationInsightsServiceProvider.configure({
            instrumentationKey: '<INSTRUMENT KEY>',
            applicationName: '4square',
            enableDebug: true,
            autoLogTracking:true
        });
    }
]);

app.config(function ($routeProvider) {

    $routeProvider.when("/explore", {
        controller: "placesExplorerController",
        templateUrl: "/app/views/placesresults.html"
    });

    $routeProvider.when("/places", {
        controller: "myPlacesController",
        templateUrl: "/app/views/myplaces.html"
    });

    $routeProvider.when("/about", {
        controller: "aboutController",
        templateUrl: "/app/views/about.html"
    });

    $routeProvider.otherwise({ redirectTo: "/explore" });

});