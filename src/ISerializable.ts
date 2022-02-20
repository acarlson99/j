"use strict";

interface ISerializable<T> {
  // T === serialize(deserialize(T))
  serialize(): string;
  deserialize(input: string): T;
}

export default ISerializable;
