/// <reference path="./typings/angularjs/angularjs.d.ts" />
module AngularJs.AppInsightJsV2 {
    
export class Utils {
    static noop: (...args: any[]) => void = angular.noop;

    public static isNullOrUndefined(input: any): boolean {
        return input === null || input === undefined;
    }


    /**
    * Creates a new GUID.
    * @return {string} A GUID.
    */
    public static newGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(GuidRegex, function (c) {
            // tslint:disable-next-line:insecure-random
            var r = (Math.random() * 16 | 0), v = (c === 'x' ? r : r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}
const GuidRegex = /[xy]/g;
}