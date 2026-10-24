export function defineMethod(name, params, logged, handler) {
  return (...args) => {
    const values = Object.fromEntries(params.map((key, index) => [key, args[index]]));
    console.info(name, Object.fromEntries(Object.entries(values).filter(([key]) => logged.includes(key))));
    return handler(values);
  };
}
