import { Nodo } from './node';

export interface List {
  head: Nodo;
  append(title: string, link: Array<string>): void;
  saveIntoFile(current: Nodo): Generator;
  saveAll(): void;
}