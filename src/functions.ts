import { Binary, Encoded } from "./gen.ts";

const BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ULID_LEN = 26;
const BINARY_LEN = 128;

export const time_binary = (): bigint => {
  const time = Date.now();
  const result = BigInt(time) << BigInt(80);
  return result;
};

export const random_binary = (): bigint => {
  const arr = new Uint16Array(5);
  self.crypto.getRandomValues(arr);
  let result = BigInt(0);
  for (let i = 0; i < 5; i++) {
    result = result | BigInt(BigInt(arr[i]) << BigInt(i * 16));
  }
  return result;
};

export const encode_base32 = (bin: Binary): Encoded => {
  if (bin?.length !== BINARY_LEN) {
    throw new Error("Invalid binary length: Should be 128.");
  }
  const filled_bin = "00" + bin;
  const buffer: string[] = new Array(ULID_LEN);
  for (let i = 0; i < ULID_LEN; i++) {
    let slice: string;
    if (i == 0) {
      slice = filled_bin.slice(-5);
    } else {
      slice = filled_bin.slice(-5 * (i + 1), -5 * i);
    }
    const decimal = parseInt(slice, 2);
    const x = BASE32[decimal];
    buffer[i] = x;
  }
  return buffer.reverse().join("");
};
