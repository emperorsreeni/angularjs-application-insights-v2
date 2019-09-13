/// <reference path="./ApplicationInsights.ts" />
/// <reference path="./ApplicationInsightsConfig.ts" />
/// <reference path="./typings/angularjs/angularjs.d.ts" />
module AngularJs.AppInsightJsV2 {
    var angularAppInsights: any = angular.module("ApplicationInsightsModule", []);
    angularAppInsights.provider('applicationInsightsService', () => new ApplicationInsightsProvider());

    angularAppInsights.config(["$provide", ($provide) => {
        angularAppInsights.logInterceptor = new LogInterceptor($provide);
        angularAppInsights.exceptionInterceptor = new ExceptionInterceptor($provide);
    }
    ]);


    export class ApplicationInsightsProvider implements angular.IServiceProvider {
        private _options: ApplicationInsightsConfig;

        configure(options: ApplicationInsightsConfig) {
            this._options = options;

        }
        $get = () => {
            var service = new ApplicationInsightsService(this._options, angularAppInsights.logInterceptor, angularAppInsights.exceptionInterceptor);
            service.init();
            return service;
        };
    }



    angularAppInsights.run([
        "$rootScope", "$location", "applicationInsightsService",
        ($rootScope: angular.IRootScopeService, $location: angular.ILocationService, applicationInsightsService: ApplicationInsightsService) => {
            var locationChangeStartOn: number;
            var stateChangeStartOn: number;
            var previousUri: any;
            var telemetryInitializer = (envelope) => {
                console.log('envelope', envelope);
                envelope.tags["ai.operation.name"] = getSPAName(applicationInsightsService.config, $location);
                if (envelope.baseType == 'PageviewData') {
                    var query = $location.search();
                    if (typeof query != undefined)
                        envelope.data.query = query;
                }
                if (envelope.baseType == 'PageviewPerformanceData') {
                    envelope.baseData.uri = $location.absUrl();
                }
            };
            applicationInsightsService.addTelemetryInitializer(telemetryInitializer);
            $rootScope.$on("$locationChangeStart", (_event: any, _next: any, current: any) => {
                previousUri = current;
                locationChangeStartOn = (new Date()).getTime();
            });

            $rootScope.$on("$locationChangeSuccess", (event: any, view: any) => {
                if (applicationInsightsService.config.enableDebug)
                    console.log(event, view, $location.path());

                if (!applicationInsightsService.config.autoStateChangeTracking) {
                    var duration = (new Date()).getTime() - locationChangeStartOn;
                    var spaRouteName = getSPAName(applicationInsightsService.config, $location);
                    if (view)
                        spaRouteName += "#" + view;

                    var telemetry = {
                        name: spaRouteName,
                        url: $location.absUrl(),
                        refUri: previousUri,
                        measurements: { "routeChangeDuration": duration }
                    };
                    applicationInsightsService.trackPageView(telemetry);

                    if (applicationInsightsService.config.enableDebug)
                        console.log('$locationChangeSuccess->trackPageView', applicationInsightsService);
                }

            });

            $rootScope.$on("$stateChangeStart", (_event: any, toState: any, _toParams: any, _fromState: any, _fromParams: any, _options: any) => {
                previousUri = toState;
                if (applicationInsightsService.config.autoStateChangeTracking) {
                    stateChangeStartOn = (new Date()).getTime();
                }
            });

            $rootScope.$on("$stateChangeSuccess", (event: any, toState: any, toParams: any, fromState: any, fromParams: any, options: any) => {
                if (applicationInsightsService.config.enableDebug)
                    console.log(event, toState, toParams, fromState, fromParams, options, $location.path());

                if (applicationInsightsService.config.autoStateChangeTracking) {
                    var duration = (new Date()).getTime() - stateChangeStartOn;
                    var spaRouteName = getSPAName(applicationInsightsService.config, $location);
                    if (toState)
                        spaRouteName += "#" + toState;
                    var telemetry = {
                        name: spaRouteName,
                        url: $location.absUrl(),
                        refUri: previousUri,
                        measurements: { "routeChangeDuration": duration }
                    };
                    applicationInsightsService.trackPageView(telemetry);

                    if (applicationInsightsService.config.enableDebug)
                        console.log('$stateChangeSuccess->trackPageView', spaRouteName, toState, { "routeChangeDuration": duration, refUri: fromState });
                }
            });
        }
    ]);

    function getSPAName(config, location) {
        return config.applicationName + location.path();
    }
}