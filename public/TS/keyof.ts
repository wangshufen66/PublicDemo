// type AppConfig = {
//   username: string;
//   layout: string;
// };

// type AppConfigKey = keyof AppConfig;

// const direction = 'left';
// type CssPadding = `padding-${typeof direction}`;

// console.log(typeof direction);
// console.log(`padding-${direction}`);

// const a = { name: '张三', age: 18 };
// type aType = typeof a;
// type keyofa = keyof typeof a;

type Direction = 'left' | 'right' | 'top' | 'bottom';

type InferRoot<T> = T extends `${infer K}${Capitalize<Direction>}` ? K : T;

type Result1 = InferRoot<'marginRight'>;
// type Result1 = 'margin';

type Result2 = InferRoot<'paddingleft'>;
// type Result2 = 'padding';

enum Status {
  'not_started',
  'progress',
  'completed',
  'failed',
}

// console.log(Object.values(Status));
type Type<T> = T extends any[] ? T[number] : T;

type test = Type<number[]>; // number
type test1 = Type<string[]>; // string
type test2 = Type<string>; // string
