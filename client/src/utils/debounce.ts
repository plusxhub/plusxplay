function debouncer(fn:any, delay:number) {
    let timeoutID: number;
    return function() {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            fn.call(this, arguments);
        }, delay);
    }
}
export default debouncer;
