"use strict";

interface ISerializable {
  // new T() === T.deserialize(new T().serialize())
  serialize(): string;
}

export default ISerializable;
