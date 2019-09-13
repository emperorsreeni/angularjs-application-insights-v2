'use strict';
app.controller('aboutController', function ($scope, $log, applicationInsightsService) {
    init();

    function init() {
        $log.info("About page loaded", {name:'about page'});
        applicationInsightsService.trackEvent({
            name: "PageLoaded", properties:
            {
                "sessionId": "sss-0004--5454--545454",
                "appId": "ddd-fff-ddd-ff-ddfdd-45454",
                "userId": "ddd-fff-ddd-ff-ddfdd",
                "timeStamp": new Date().toDateString(),
                "page": "About Page",
                "action": "page loaded"
            }, measurements: {
                duration:675
            }
        });
        $log.error("This is catrascophic error!");
    }

});