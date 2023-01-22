// Makes some specified keys in a type to not optional/required
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
