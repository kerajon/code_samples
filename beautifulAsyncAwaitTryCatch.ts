/**
 * Use almost like in GO Lang.
 *
 * let { error, lollipop } = await to( candyModel.getMeLollipop() );
 * if (error) {
 *    // :(
 * }
 */
async function to(promise: Promise<any>) {
    let indexOfValue: number = -1;
    let values: any[];
    const restrictedPropNames: string[] = ['then', 'catch'];
    const proxy = new Proxy({}, {
        get: function (obj: { [key: string]: any }, prop: string) {
            if (restrictedPropNames.indexOf(prop) > -1) {
                obj[prop] = values[++indexOfValue];
                return obj[prop];
            }
        }
    });
    return promise.then((data: any) => {
        values = [null, data];
        return proxy;
    }).catch((error: Error | { [key: string]: any }) => {
        values = [error];
        return proxy;
    });
}
