/// <reference path="Utils.ts" />
module AngularJs.AppInsightJsV2{
// $log interceptor .. will send log data to application insights, once app insights is 
// registered. $provide is only available in the config phase, so we need to setup
// the decorator before app insights is instantiated.
export class LogInterceptor {

    private _debugFn: any;
    private _infoFn: any;
    private _warnFn: any;
    private _logFn: any;
    static interceptFuntion: any;
    private _noop: any;

    constructor($provide: any) {
        this._noop = Utils.noop;

        // function to invoke ... initialized to noop
        LogInterceptor.interceptFuntion = this._noop;


        $provide.decorator('$log', [
            "$delegate", ($delegate: any) => {
                this._debugFn = $delegate.debug;
                this._infoFn = $delegate.info;
                this._warnFn = $delegate.warn;
                this._logFn = $delegate.log;

                $delegate.debug = angular.extend(this.delegator(this._debugFn, 0), this._debugFn);
                $delegate.info = angular.extend(this.delegator(this._infoFn, 1), this._infoFn);
                $delegate.warn = angular.extend(this.delegator(this._warnFn, 2), this._warnFn);
                $delegate.log = angular.extend(this.delegator(this._logFn, 1), this._logFn);

                return $delegate;
            }
        ]);
    }

    setInterceptFunction(func: (message: any, level: any,properties:any) => void) {
        LogInterceptor.interceptFuntion = func;
    }

    getPrivateLoggingObject() {
        return {
            debug: Utils.isNullOrUndefined(this._debugFn) ? this._noop : this._debugFn,
            info: Utils.isNullOrUndefined(this._infoFn) ? this._noop : this._infoFn,
            warn: Utils.isNullOrUndefined(this._warnFn) ? this._noop : this._warnFn,
            error: this._noop,
            log: Utils.isNullOrUndefined(this._logFn) ? this._noop : this._logFn
        };
    }

    delegator(originalFn, level) {

        var interceptingFn = function () {
            var args = [].slice.call(arguments);
            // track the call
            var message = args.join(' ');
            
            var length = args.length;
            //reserve the last arguments to pass the custom properties to application insights
            //example: $log.info("message 1","message 2",..."message n", properties)
            LogInterceptor.interceptFuntion(message, level,length > 1 ? args[length-1] : {});
            // Call the original 
            originalFn.apply(null, args);
        };

        for (var n in originalFn) {

            interceptingFn[n] = originalFn[n];
        }

        return interceptingFn;
    }

}
}