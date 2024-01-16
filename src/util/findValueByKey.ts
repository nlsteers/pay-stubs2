// function recursively searches a json object of unknown depth for a specified key, returns key value if found or undefined
export default function findValueByKey(jsonObj: any, key: string): any {
  if (jsonObj instanceof Array) {
    for (const element of jsonObj) {
      const value = findValueByKey(element, key)
      if (value !== undefined) {
        return value
      }
    }
  } else if (typeof jsonObj === 'object') {
    const keys = Object.keys(jsonObj);
    for (const k of keys) {
      if (k === key) {
        return jsonObj[k]
      } else {
        const value = findValueByKey(jsonObj[k], key)
        if (value !== undefined) {
          return value
        }
      }
    }
  }
  return undefined
}

