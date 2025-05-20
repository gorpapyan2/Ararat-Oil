/**
 * Object manipulation utility functions
 */

/**
 * Safely access nested object properties
 * @param obj The object to access
 * @param path Dot notation path to the property
 * @param defaultValue Default value if property doesn't exist
 */
export function get<T = any>(obj: any, path: string, defaultValue: T | undefined = undefined): T | undefined {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res: any, key: string) => (res !== null && res !== undefined ? res[key] : res), obj);
      
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

/**
 * Filter null and undefined values from an object
 * @param obj Object to filter
 */
export function omitNullish<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Determines if a value is a plain object
 * @param value Value to check
 */
export function isPlainObject(value: any): boolean {
  return typeof value === 'object' 
    && value !== null 
    && value.constructor === Object 
    && Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Deep merges two objects
 * @param target Target object
 * @param source Source object to merge
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof typeof source;
      const targetKey = key as keyof typeof target;
      
      if (isPlainObject(source[sourceKey]) && key in target) {
        (output as any)[targetKey] = deepMerge(
          target[targetKey],
          source[sourceKey] as any
        );
      } else {
        (output as any)[targetKey] = source[sourceKey];
      }
    });
  }
  
  return output;
}

/**
 * Picks specified properties from an object
 * @param obj Source object
 * @param keys Keys to pick
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * Omits specified properties from an object
 * @param obj Source object
 * @param keys Keys to omit
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  return Object.keys(obj).reduce((result, key) => {
    if (!keys.includes(key as K)) {
      result[key as keyof Omit<T, K>] = obj[key as keyof T] as any;
    }
    return result;
  }, {} as Omit<T, K>);
} 