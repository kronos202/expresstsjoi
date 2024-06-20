export function ReqDetail(target: any, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDescriptor.value;

    propertyDescriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyName} with arguments: ${JSON.stringify(args)}`);
        const start = Date.now();
        const result = method.apply(this, args);
        const end = Date.now();
        console.log(`${propertyName} executed in ${end - start}ms`);
        return result;
    };

    return propertyDescriptor;
}
