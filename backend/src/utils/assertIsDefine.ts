

export function assertIsDefine<T>(val: T): asserts val is NonNullable<T> {

    if (!val) {
        console.log("error from assertisDEfine")
        throw Error("Expected 'val' to be defined,but received ")
    }
}