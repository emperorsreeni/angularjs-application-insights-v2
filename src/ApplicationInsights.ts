/// <reference path="./ApplicationInsightsConfig.ts" />
/// <reference path="./ExceptionInterceptor.ts" />
/// <reference path="./LogInterceptor.ts" />
/// <reference path="Utils.ts" />
/// <reference path="./typings/applicationinsights-js/applicationinsights-js.d.ts"/>

module AngularJs.AppInsightJsV2 {
    declare var appInsights: Microsoft.ApplicationInsights.IAppInsights;
    declare function downloadAndSetup(config: Microsoft.ApplicationInsights.IConfig): void;

    export class ApplicationInsightsService implements Microsoft.ApplicationInsights.IAppInsights {
        config: any;
        constructor(_config?: any,
            logInterceptor?: LogInterceptor,
            exceptionInterceptor?: ExceptionInterceptor) {
            this.config = _config;

            if (this.config.autoLogTracking) {
                logInterceptor.setInterceptFunction((message, level, properties?) => this.trackTrace({ message: message, severityLevel: <any>level, properties: properties }));
            }
            exceptionInterceptor.setInterceptFunction((exception, exceptionProperties) => this.trackException({ id: Utils.newGuid(), exception: exception, severityLevel: 3, properties: exceptionProperties }));
        }

        /**
         * Log a user action or other occurrence.
         */
        trackEvent(event: Microsoft.ApplicationInsights.IEventTelemetry, customProperties?: { [key: string]: any }) {
            try {
                appInsights.trackEvent(event, customProperties);
            } catch (ex) {
                console.warn('Angular application insights Error [trackEvent]: ', ex);
            }
        }

        /**
         * Start timing an extended event. Call {@link stopTrackEvent} to log the event when it ends.
         * @param   name    A string that identifies this event uniquely within the document.
         */
        startTrackEvent(name: string): any {
            try {
                appInsights.startTrackEvent(name);
            } catch (ex) {
                console.warn('Angular application insights Error [startTrackEvent]: ', ex);
            }
        }

        /**
         * Log an extended event that you started timing with {@link startTrackEvent}.
         * @param   name    The string you used to identify this event in startTrackEvent.
         * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
         * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
         */
        stopTrackEvent(name: string, properties?: { [p: string]: string }, measurements?: { [p: string]: number }): any {
            try {
                appInsights.stopTrackEvent(name, properties, measurements);
            } catch (ex) {
                console.warn('Angular application insights Error [stopTrackEvent]: ', ex);
            }
        }


        /**
         * Logs that a page or other item was viewed.
         */
        trackPageView(pageView: Microsoft.ApplicationInsights.IPageViewTelemetry, customProperties?: { [key: string]: any }) {
            try {
                appInsights.trackPageView(pageView, customProperties);
            } catch (ex) {
                console.warn('Angular application insights Error [trackPageView]: ', ex);
            }
        }

        /**
         * Starts timing how long the user views a page or other item. Call this when the page opens.
         * This method doesn't send any telemetry. Call {@link stopTrackTelemetry} to log the page when it closes.
         * @param   name  A string that idenfities this item, unique within this HTML document. Defaults to the document title.
         */
        startTrackPage(name?: string) {
            try {
                appInsights.startTrackPage(name);
            } catch (ex) {
                console.warn('Angular application insights Error [startTrackPage]: ', ex);
            }
        }

        /**
         * Logs how long a page or other item was visible, after {@link startTrackPage}. Call this when the page closes.
         * @param   name  The string you used as the name in startTrackPage. Defaults to the document title.
         * @param   url   String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
         * @param   properties  map[string, string] - additional data used to filter pages and metrics in the portal. Defaults to empty.
         * @param   measurements    map[string, number] - metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.
         */
        stopTrackPage(name?: string, url?: string, customProperties?: Object) {
            try {
                appInsights.stopTrackPage(name, url, customProperties);
            } catch (ex) {
                console.warn('Angular application insights Error [stopTrackPage]: ', ex);
            }
        }

        /**
         * Log a numeric value that is not associated with a specific event. Typically used to send regular reports of performance indicators.
         * To send a single measurement, use just the first two parameters. If you take measurements very frequently, you can reduce the
         * telemetry bandwidth by aggregating multiple measurements and sending the resulting average at intervals.
         */
        trackMetric(metric: Microsoft.ApplicationInsights.IMetricTelemetry, customProperties?: { [key: string]: any }) {
            try {
                appInsights.trackMetric(metric, customProperties);
            } catch (ex) {
                console.warn('Angular application insights Error [trackTrace]: ', ex);
            }
        }

        /**
         * Log an exception you have caught.
         */
        trackException(exception: Microsoft.ApplicationInsights.IExceptionTelemetry, customProperties?: { [key: string]: any }) {
            try {
                appInsights.trackException(exception, customProperties);
            } catch (ex) {
                console.warn('Angular application insights Error [trackException]: ', ex);
            }
        }

        // trackTrace(message: string, properties?: {[string]:string}, severityLevel?: SeverityLevel | AI.SeverityLevel)
        // Log a diagnostic event such as entering or leaving a method.
        /**
         * Log a diagnostic message.
         */
        trackTrace(trace: Microsoft.ApplicationInsights.ITraceTelemetry, customProperties?: { [key: string]: any }) {
            try {
                appInsights.trackTrace(trace, customProperties);
            } catch (ex) {
                console.warn('Angular application insights Error [trackTrace]: ', ex);
            }
        }


        // flush()
        // Immediately send all queued telemetry. Synchronous.
        // * You don't usually have to use this, as it happens automatically on window closing.
        flush() {
            try {
                appInsights.flush();
            } catch (ex) {
                console.warn('Angular application insights Error [flush]: ', ex);
            }

        }

        /**
         * Sets the authenticated user id and the account id.
         * User auth id and account id should be of type string. They should not contain commas, semi-colons, equal signs, spaces, or vertical-bars.
         * 
         * By default the method will only set the authUserID and accountId for all events in this page view. To add them to all events within
         * the whole session, you should either call this method on every page view or set `storeInCookie = true`. 
         *
         * @param authenticatedUserId {string} - The authenticated user id. A unique and persistent string that represents each authenticated user in the service.
         * @param accountId {string} - An optional string to represent the account associated with the authenticated user.
         * @param storeInCookie {boolean} - AuthenticateUserID will be stored in a cookie and added to all events within this session. 
         */
        setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie: boolean = false) {
            try {
                appInsights.setAuthenticatedUserContext(authenticatedUserId, accountId, storeInCookie);
            } catch (ex) {
                console.warn('Angular application insights Error [setAuthenticatedUserContext]: ', ex);
            }
        }

        /**
         * Clears the authenticated user id and the account id from the user context.
         */
        clearAuthenticatedUserContext() {
            try {
                appInsights.clearAuthenticatedUserContext();
            } catch (ex) {
                console.warn('Angular application insights Error [clearAuthenticatedUserContext]: ', ex);
            }
        }

        _onerror(exception: Microsoft.ApplicationInsights.IAutoExceptionTelemetry): void {

            try {
                appInsights._onerror(exception);
                if (this.config.enableDebug)
                    console.warn('Angular application insights Error [_onerror]: ', exception.message);
            } catch (ex) {
                console.warn('Angular application insights Error [_onerror]: ', ex);
            }

        }


        trackPageViewPerformance(pageViewPerformance: Microsoft.ApplicationInsights.IPageViewPerformanceTelemetry, customProperties?: { [key: string]: any }): void {
            try {
                appInsights.trackPageViewPerformance(pageViewPerformance, customProperties);
            } catch (ex) {
                console.warn('Angular application insights Error [trackPageViewPerformance]: ', ex);
            }
        }

        addTelemetryInitializer(telemetryInitializer: (item: Microsoft.ApplicationInsights.ITelemetryItem) => boolean | void) {

            appInsights.addTelemetryInitializer(telemetryInitializer);
        }

        /**
        * Initialize Application Insights for Angular
        * Make sure your config{} has been set
        */
        public init(): void {
            if (this.config) {
                if (this.config.instrumentationKey) {
                    try {
                        downloadAndSetup(this.config);

                    } catch (ex) {
                        console.warn('Angular application insights Error [downloadAndSetup]: ', ex);
                    }
                } else {
                    console.warn('An instrumentationKey value is required to initialize ApplicationInsightsService');
                }
            } else {
                console.warn('You need to initialize the ApplicationInsightsService with an instrumentationKey while angular js app bootstrap');
            }
        }
    }
}