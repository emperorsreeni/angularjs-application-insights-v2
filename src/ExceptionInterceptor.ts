/// <reference path="Utils.ts" />
/// <reference path="./typings/angularjs/angularjs.d.ts" />

module AngularJs.AppInsightJsV2{

// Angular JS Exception interceptor
// Intercepts calls to the $exceptionHandler and sends them to Application insights as exception telemetry.
export class ExceptionInterceptor {

    private _origExceptionHandler;
    private _interceptFunction;

    static errorOnHttpCall: boolean;

    setInterceptFunction(func) {
        this._interceptFunction = func;
    }

    getPrivateExceptionHanlder() {
        return Utils.isNullOrUndefined(this._origExceptionHandler)? angular.noop : this._origExceptionHandler;
    }

    constructor($provide: any) {

        ExceptionInterceptor.errorOnHttpCall = false;

        this._interceptFunction = angular.noop;

        $provide.decorator('$exceptionHandler', [
            '$delegate', ($delegate) => {
                this._origExceptionHandler = $delegate;
                return (exception) => {
                    // track the call 
                    // ... only if there is no active issues/errors sending data over http, in order to prevent an infinite loop.
                    if (!ExceptionInterceptor.errorOnHttpCall) {
                        this._interceptFunction(exception);
                    }
                    // Call the original 
                    this._origExceptionHandler(exception);
                };
            }
        ]);
    }

}
}