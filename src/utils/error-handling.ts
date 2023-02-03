type ProduceConditionsMapper<T> = {
  [K in keyof T]?: string[];
};

export const pickObjectKeys = <
  T extends ProduceConditionsMapper<T>,
  K extends keyof T
>(
  obj: T,
  keys: K[]
): { [O in K]: string[] } => {
  return keys.reduce((newObj, curr) => {
    newObj[curr] = obj[curr] || [];

    return newObj;
  }, {} as { [O in K]: string[] });
};

// import { type RouterInputs } from "./trpc";
// export const plucZodErrors = <
//   T extends ProduceConditionsMapper<T> | null,
//   K extends keyof T
// >(
//   obj: T,
//   keys: K[]
// ): { [O in K]: string[] } => {
//   if (!obj) {
//     return keys.reduce((newObj, curr) => {
//       newObj[curr] = [];

//       return newObj;
//     }, {} as { [O in K]: string[] });
//   }
//   return pickObjectKeys(obj, keys);
// };
// type PostCreateInput = RouterInputs["auth"]["login"];
// type InputErrors = ProduceConditionsMapper<PostCreateInput>;

// type ProduceConditionsMapper<T> = {
//   [K in keyof T]?: string[];
// };
