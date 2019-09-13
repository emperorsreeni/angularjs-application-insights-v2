# Angular Azure Application Insights implementation

## Connect your AngularJS client-side to Microsofts Application Insights with this easy-to-use Module.

 >Application Insights is an extensible Application Performance Management (APM) service for web developers on multiple platforms. Use it to monitor your live web application. It will automatically detect performance anomalies. It includes powerful analytics tools to help you diagnose issues and to understand what users actually do with your app.
---
## Installation

### NPM Setup

Install & save the library to your package.json:

```bash
$ npm install -save angularjs-application-insights-v2
```

### Including javascript file in the browser

* Copy the angularjs-appinsights-v2.min.js from **dist** folder to your project **scripts** folder 
* Include this script file into your application shell html file
```html
<script type="text/javascript" src="scripts/angularjs-appinsights-v2.min.js"></script>
```

### Initialization Setup
* Include **ApplicationInsightsModule** in your application module dependency
```js
var app = angular.module('<appname>', [....,'ApplicationInsightsModule']);
```
* Add the following snippet into your app.js
```js
app.config([
    'applicationInsightsServiceProvider', function (applicationInsightsServiceProvider) {
        applicationInsightsServiceProvider.configure({
            instrumentationKey: 'INSTRUMENTATION_KEY',
            applicationName: '<app name>'
        });
    }
]);
```
### API Specficiations
Once you add the ***angularjs-appinsights-v2.min.js*** into your application, it will load necessary sdk files and initialize the Application Insights instance. The initialized instance located by default at `window.appInsights`. **ApplicationInsightsService** is an angular service which provides the wrapper the Application Insights instance and it has following API functions.

```ts
applicationInsightsService.trackEvent(event: Microsoft.ApplicationInsights.IEventTelemetry, customProperties:object);
applicationInsightsService.startTrackEvent(name: string);
applicationInsightsService.stopTrackEvent(name: string, properties?: object, measurements?:object);
applicationInsightsService.trackPageView(pageView: Microsoft.ApplicationInsights.IPageViewTelemetry, customProperties?:object);
applicationInsightsService.startTrackPage(name?: string);
applicationInsightsService.stopTrackPage(name?: string, url?: string, customProperties?: object);
applicationInsightsService.trackMetric(metric: Microsoft.ApplicationInsights.IMetricTelemetry, customProperties?:object);
applicationInsightsService.trackException(exception: Microsoft.ApplicationInsights.IExceptionTelemetry, customProperties?:object);
applicationInsightsService.trackTrace(trace: Microsoft.ApplicationInsights.ITraceTelemetry, customProperties?: object);
applicationInsightsService.flush();
applicationInsightsService.setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean);
applicationInsightsService.clearAuthenticatedUserContext();
applicationInsightsService._onerror(exception: Microsoft.ApplicationInsights.IAutoExceptionTelemetry);
applicationInsightsService.trackPageViewPerformance(pageViewPerformance: Microsoft.ApplicationInsights.IPageViewPerformanceTelemetry, customProperties?: object});
applicationInsightsService.addTelemetryInitializer(telemetryInitializer: (item: Microsoft.ApplicationInsights.ITelemetryItem) => boolean | void);
```

***Example:***
```js
applicationInsightsService.trackEvent({name: 'some event'});
applicationInsightsService.trackPageView({name: 'some page'});
applicationInsightsService.trackPageViewPerformance({name : 'some page', url: 'some url'});
applicationInsightsService.trackException({exception: new Error('some error')});
applicationInsightsService.trackTrace({message: 'some trace'});
applicationInsightsService.trackMetric({name: 'some metric', average: 42});
applicationInsightsService.trackDependencyData({absoluteUrl: 'some url', responseCode: 200, method: 'GET', id: 'some id'});
applicationInsightsService.startTrackPage("pageName");
applicationInsightsService.stopTrackPage("pageName", {customProp1: "some value"});
applicationInsightsService.startTrackEvent("event");
applicationInsightsService.stopTrackEvent("event", {customProp1: "some value"});
applicationInsightsService.setAuthenticatedUserContext('ddd-ddd-dddd-dddd');
applicationInsightsService.clearAuthenticatedUserContext();
applicationInsightsService.flush();
```

### How to send custom events to Application Insights?
* Inject the ApplicationInsightsService service into a controller
```js
app.controller('testController', function ($scope, .... , $log, applicationInsightsService) {
```
* Use the following snippet to send the custom events to your application insights instance
```js
 applicationInsightsService.trackEvent({
            name: "PageLoaded",
            properties:
            {
                "appId": "ddd-fff-ddd-ff-ddfdd-45454",
                "timeStamp": new Date().toDateString(),
                "page": "Explorer Page",
                "action": "page loaded"
            },
            measurements: {
                duration: 567
            }
        });
```

### How to send application traces to Application Insights?
You can send the application traces to application insights to add additional infomration to your telemetry data.
* Enable the  ***autoLogTracking:true*** in application insights config inside app.js
```js
app.config([
    'applicationInsightsServiceProvider', function (applicationInsightsServiceProvider) {
        applicationInsightsServiceProvider.configure({
            instrumentationKey: 'INSTRUMENTATION_KEY',
            applicationName: '<app name>',
            autoLogTracking:true
        });
    }
]);
```
* Inject the ApplicationInsightsService service into a controller/service
```js
app.controller('testController', function ($scope, .... , $log, applicationInsightsService) {
```
* Add the following snippet where you want to add the trace inside your controller or service
```js
$log.info("About page loaded", {name:'about page'});

```

### How to add the telemetry initializer to application insights
Use can use the telemetry intializer to customize the global data which sending to applicaiton insights apart from the custom data. 
You can use this to set custom role name, operation name, user id, session id, etc.
Use the following snippets to add your telemery insitializer
```js
 app.run(["$rootScope", "$location", "applicationInsightsService",
        function ($rootScope, $location, applicationInsightsService) {
             var customTelemetryInitializer = function (envelope) {
                envelope.tags["ai.cloud.role"] = "your role name";
                envelope.tags["ai.cloud.roleInstance"] = "your role instance";
                envelope.tags["ai.operation.name"] = "customized operation name"
             }
             applicationInsightsService.addTelemetryInitializer(customTelemetryInitializer);
        }
 ]);
```

## How to build from the Source?

To build from source follow the following instructions,
* Download the source to your local computer
* Install all required packages
```bash
$ npm install
```
* Build the source with gulp
```bash
$ gulp build
```

## Credits

This project influnced by the following projects,
* [VladimirRybalko/angular-applicationinsights](https://github.com/VladimirRybalko/angular-applicationinsights)
* [TrilonIO/angular-application-insights](https://github.com/TrilonIO/angular-application-insights)

Test porject used from this [tjoudeh/FoursquareAngularJS](https://github.com/tjoudeh/FoursquareAngularJS) repository.