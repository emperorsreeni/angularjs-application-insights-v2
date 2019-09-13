var AngularJs;
(function (AngularJs) {
    var AppInsightJsV2;
    (function (AppInsightJsV2) {
        var ApplicationInsightsConfig = (function () {
            function ApplicationInsightsConfig() {
            }
            return ApplicationInsightsConfig;
        }());
        AppInsightJsV2.ApplicationInsightsConfig = ApplicationInsightsConfig;
    })(AppInsightJsV2 = AngularJs.AppInsightJsV2 || (AngularJs.AppInsightJsV2 = {}));
})(AngularJs || (AngularJs = {}));
var AngularJs;
(function (AngularJs) {
    var AppInsightJsV2;
    (function (AppInsightJsV2) {
        var Utils = (function () {
            function Utils() {
            }
            Utils.isNullOrUndefined = function (input) {
                return input === null || input === undefined;
            };
            Utils.newGuid = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(GuidRegex, function (c) {
                    var r = (Math.random() * 16 | 0), v = (c === 'x' ? r : r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };
            Utils.noop = angular.noop;
            return Utils;
        }());
        AppInsightJsV2.Utils = Utils;
        var GuidRegex = /[xy]/g;
    })(AppInsightJsV2 = AngularJs.AppInsightJsV2 || (AngularJs.AppInsightJsV2 = {}));
})(AngularJs || (AngularJs = {}));
var AngularJs;
(function (AngularJs) {
    var AppInsightJsV2;
    (function (AppInsightJsV2) {
        var ExceptionInterceptor = (function () {
            function ExceptionInterceptor($provide) {
                var _this = this;
                ExceptionInterceptor.errorOnHttpCall = false;
                this._interceptFunction = angular.noop;
                $provide.decorator('$exceptionHandler', [
                    '$delegate', function ($delegate) {
                        _this._origExceptionHandler = $delegate;
                        return function (exception) {
                            if (!ExceptionInterceptor.errorOnHttpCall) {
                                _this._interceptFunction(exception);
                            }
                            _this._origExceptionHandler(exception);
                        };
                    }
                ]);
            }
            ExceptionInterceptor.prototype.setInterceptFunction = function (func) {
                this._interceptFunction = func;
            };
            ExceptionInterceptor.prototype.getPrivateExceptionHanlder = function () {
                return AppInsightJsV2.Utils.isNullOrUndefined(this._origExceptionHandler) ? angular.noop : this._origExceptionHandler;
            };
            return ExceptionInterceptor;
        }());
        AppInsightJsV2.ExceptionInterceptor = ExceptionInterceptor;
    })(AppInsightJsV2 = AngularJs.AppInsightJsV2 || (AngularJs.AppInsightJsV2 = {}));
})(AngularJs || (AngularJs = {}));
var AngularJs;
(function (AngularJs) {
    var AppInsightJsV2;
    (function (AppInsightJsV2) {
        var LogInterceptor = (function () {
            function LogInterceptor($provide) {
                var _this = this;
                this._noop = AppInsightJsV2.Utils.noop;
                LogInterceptor.interceptFuntion = this._noop;
                $provide.decorator('$log', [
                    "$delegate", function ($delegate) {
                        _this._debugFn = $delegate.debug;
                        _this._infoFn = $delegate.info;
                        _this._warnFn = $delegate.warn;
                        _this._logFn = $delegate.log;
                        $delegate.debug = angular.extend(_this.delegator(_this._debugFn, 0), _this._debugFn);
                        $delegate.info = angular.extend(_this.delegator(_this._infoFn, 1), _this._infoFn);
                        $delegate.warn = angular.extend(_this.delegator(_this._warnFn, 2), _this._warnFn);
                        $delegate.log = angular.extend(_this.delegator(_this._logFn, 1), _this._logFn);
                        return $delegate;
                    }
                ]);
            }
            LogInterceptor.prototype.setInterceptFunction = function (func) {
                LogInterceptor.interceptFuntion = func;
            };
            LogInterceptor.prototype.getPrivateLoggingObject = function () {
                return {
                    debug: AppInsightJsV2.Utils.isNullOrUndefined(this._debugFn) ? this._noop : this._debugFn,
                    info: AppInsightJsV2.Utils.isNullOrUndefined(this._infoFn) ? this._noop : this._infoFn,
                    warn: AppInsightJsV2.Utils.isNullOrUndefined(this._warnFn) ? this._noop : this._warnFn,
                    error: this._noop,
                    log: AppInsightJsV2.Utils.isNullOrUndefined(this._logFn) ? this._noop : this._logFn
                };
            };
            LogInterceptor.prototype.delegator = function (originalFn, level) {
                var interceptingFn = function () {
                    var args = [].slice.call(arguments);
                    var message = args.join(' ');
                    var length = args.length;
                    LogInterceptor.interceptFuntion(message, level, length > 1 ? args[length - 1] : {});
                    originalFn.apply(null, args);
                };
                for (var n in originalFn) {
                    interceptingFn[n] = originalFn[n];
                }
                return interceptingFn;
            };
            return LogInterceptor;
        }());
        AppInsightJsV2.LogInterceptor = LogInterceptor;
    })(AppInsightJsV2 = AngularJs.AppInsightJsV2 || (AngularJs.AppInsightJsV2 = {}));
})(AngularJs || (AngularJs = {}));
var AngularJs;
(function (AngularJs) {
    var AppInsightJsV2;
    (function (AppInsightJsV2) {
        var ApplicationInsightsService = (function () {
            function ApplicationInsightsService(_config, logInterceptor, exceptionInterceptor) {
                var _this = this;
                this.config = _config;
                if (this.config.autoLogTracking) {
                    logInterceptor.setInterceptFunction(function (message, level, properties) { return _this.trackTrace({ message: message, severityLevel: level, properties: properties }); });
                }
                exceptionInterceptor.setInterceptFunction(function (exception, exceptionProperties) { return _this.trackException({ id: AppInsightJsV2.Utils.newGuid(), exception: exception, severityLevel: 3, properties: exceptionProperties }); });
            }
            ApplicationInsightsService.prototype.trackEvent = function (event, customProperties) {
                try {
                    appInsights.trackEvent(event, customProperties);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [trackEvent]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.startTrackEvent = function (name) {
                try {
                    appInsights.startTrackEvent(name);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [startTrackEvent]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.stopTrackEvent = function (name, properties, measurements) {
                try {
                    appInsights.stopTrackEvent(name, properties, measurements);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [stopTrackEvent]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.trackPageView = function (pageView, customProperties) {
                try {
                    appInsights.trackPageView(pageView, customProperties);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [trackPageView]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.startTrackPage = function (name) {
                try {
                    appInsights.startTrackPage(name);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [startTrackPage]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.stopTrackPage = function (name, url, customProperties) {
                try {
                    appInsights.stopTrackPage(name, url, customProperties);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [stopTrackPage]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.trackMetric = function (metric, customProperties) {
                try {
                    appInsights.trackMetric(metric, customProperties);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [trackTrace]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.trackException = function (exception, customProperties) {
                try {
                    appInsights.trackException(exception, customProperties);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [trackException]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.trackTrace = function (trace, customProperties) {
                try {
                    appInsights.trackTrace(trace, customProperties);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [trackTrace]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.flush = function () {
                try {
                    appInsights.flush();
                }
                catch (ex) {
                    console.warn('Angular application insights Error [flush]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.setAuthenticatedUserContext = function (authenticatedUserId, accountId, storeInCookie) {
                if (storeInCookie === void 0) { storeInCookie = false; }
                try {
                    appInsights.setAuthenticatedUserContext(authenticatedUserId, accountId, storeInCookie);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [setAuthenticatedUserContext]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.clearAuthenticatedUserContext = function () {
                try {
                    appInsights.clearAuthenticatedUserContext();
                }
                catch (ex) {
                    console.warn('Angular application insights Error [clearAuthenticatedUserContext]: ', ex);
                }
            };
            ApplicationInsightsService.prototype._onerror = function (exception) {
                try {
                    appInsights._onerror(exception);
                    if (this.config.enableDebug)
                        console.warn('Angular application insights Error [_onerror]: ', exception.message);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [_onerror]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.trackPageViewPerformance = function (pageViewPerformance, customProperties) {
                try {
                    appInsights.trackPageViewPerformance(pageViewPerformance, customProperties);
                }
                catch (ex) {
                    console.warn('Angular application insights Error [trackPageViewPerformance]: ', ex);
                }
            };
            ApplicationInsightsService.prototype.addTelemetryInitializer = function (telemetryInitializer) {
                appInsights.addTelemetryInitializer(telemetryInitializer);
            };
            ApplicationInsightsService.prototype.init = function () {
                if (this.config) {
                    if (this.config.instrumentationKey) {
                        try {
                            downloadAndSetup(this.config);
                        }
                        catch (ex) {
                            console.warn('Angular application insights Error [downloadAndSetup]: ', ex);
                        }
                    }
                    else {
                        console.warn('An instrumentationKey value is required to initialize ApplicationInsightsService');
                    }
                }
                else {
                    console.warn('You need to initialize the ApplicationInsightsService with an instrumentationKey while angular js app bootstrap');
                }
            };
            return ApplicationInsightsService;
        }());
        AppInsightJsV2.ApplicationInsightsService = ApplicationInsightsService;
    })(AppInsightJsV2 = AngularJs.AppInsightJsV2 || (AngularJs.AppInsightJsV2 = {}));
})(AngularJs || (AngularJs = {}));
var AngularJs;
(function (AngularJs) {
    var AppInsightJsV2;
    (function (AppInsightJsV2) {
        var angularAppInsights = angular.module("ApplicationInsightsModule", []);
        angularAppInsights.provider('applicationInsightsService', function () { return new ApplicationInsightsProvider(); });
        angularAppInsights.config(["$provide", function ($provide) {
                angularAppInsights.logInterceptor = new AppInsightJsV2.LogInterceptor($provide);
                angularAppInsights.exceptionInterceptor = new AppInsightJsV2.ExceptionInterceptor($provide);
            }
        ]);
        var ApplicationInsightsProvider = (function () {
            function ApplicationInsightsProvider() {
                var _this = this;
                this.$get = function () {
                    var service = new AppInsightJsV2.ApplicationInsightsService(_this._options, angularAppInsights.logInterceptor, angularAppInsights.exceptionInterceptor);
                    service.init();
                    return service;
                };
            }
            ApplicationInsightsProvider.prototype.configure = function (options) {
                this._options = options;
            };
            return ApplicationInsightsProvider;
        }());
        AppInsightJsV2.ApplicationInsightsProvider = ApplicationInsightsProvider;
        angularAppInsights.run([
            "$rootScope", "$location", "applicationInsightsService",
            function ($rootScope, $location, applicationInsightsService) {
                var locationChangeStartOn;
                var stateChangeStartOn;
                var previousUri;
                var telemetryInitializer = function (envelope) {
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
                $rootScope.$on("$locationChangeStart", function (_event, _next, current) {
                    previousUri = current;
                    locationChangeStartOn = (new Date()).getTime();
                });
                $rootScope.$on("$locationChangeSuccess", function (event, view) {
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
                $rootScope.$on("$stateChangeStart", function (_event, toState, _toParams, _fromState, _fromParams, _options) {
                    previousUri = toState;
                    if (applicationInsightsService.config.autoStateChangeTracking) {
                        stateChangeStartOn = (new Date()).getTime();
                    }
                });
                $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, options) {
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
    })(AppInsightJsV2 = AngularJs.AppInsightJsV2 || (AngularJs.AppInsightJsV2 = {}));
})(AngularJs || (AngularJs = {}));

function downloadAndSetup(config){var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";var aiName=window[sdkInstance],aisdk=window[aiName]||function(e){function n(e){i[e]=function(){var n=arguments;i.queue.push(function(){i[e].apply(i,n);})}}var i={config:e};i.initialize=!0;var a=document,t=window;setTimeout(function(){var n=a.createElement("script");n.src=e.url||"https://az416426.vo.msecnd.net/next/ai.2.min.js",a.getElementsByTagName("script")[0].parentNode.appendChild(n)});try{i.cookie=a.cookie}catch(e){}i.queue=[],i.version=2;for(var r=["Event","PageView","Exception","Trace","DependencyData","Metric","PageViewPerformance"];r.length;)n("track"+r.pop());n("startTrackPage"),n("stopTrackPage"),n("addTelemetryInitializer");var o="Track"+r[0];if(n("start"+o),n("stop"+o),!(!0===e.disableExceptionTracking||e.extensionConfig&&e.extensionConfig.ApplicationInsightsAnalytics&&!0===e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)){n("_"+(r="onerror"));var s=t[r];t[r]=function(e,n,a,t,o){var c=s&&s(e,n,a,t,o);return!0!==c&&i["_"+r]({message:e,url:n,lineNumber:a,columnNumber:t,error:o}),c},e.autoExceptionInstrumented=!0}return i}(config);window[aiName]=aisdk;}