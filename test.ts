// const numHandler = (input: number) => {
//   let digits;
//   return input;
// };

// const anExample = (input: string) => {
//   const someStrings = 'name';
//   return { someStrings };
// };

// function add(input: number, output: number) {
//   if (input + output > 0) {
//     return input + output;
//   }
//   return undefined;
// }

// class User {
//   name: string;
//   age: number | undefined;
//   occupation: string | undefined;
//   // age: number
//   constructor(name: string) {
//     this.name = name;
//     // this.age = age;
//   }
// }

// try {
//   throw 'myException';
// } catch (err: unknown) {
//   if (err instanceof Error) {
//     console.error(err.message);
//   }
// }

// type AppConfig = {
//   username: string;
//   layout: string;
// };

// type AppConfigKey = keyof AppConfig;


// type User = {
//   name: string;
//   preferences: {
//     [key: string]: string;
//   }
// };

// type UserPreferenceKey = keyof User["preferences"];

type AppConfig = {
  username: string;
  layout: string;
  age:number
};

type AppPermissions = {
  [Property in keyof AppConfig as `change${Capitalize<Property>}`]: boolean
};

// [1, 2, 3].map(value => value.toString()); // ["1", "2", "3"]


type Device = {
  manufacturer: string;
  price: number;
};

type DeviceFormatter = {
  [Key in keyof Device as `format${Capitalize<Key>}`]: (value: Device[Key]) => string;
};


interface Point3D {
  x: number;
  y: number;
  z: number;
}

type PartialPoint3D = Partial<Point3D>;
// type PartialPoint3D = {
//   x?: number;
//   y?: number;
//   z?: number;
// }