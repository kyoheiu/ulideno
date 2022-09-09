import { Binary, Encoded } from "./gen.ts";

const BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ULID_LEN = 26;
const TIME_LEN = 48;

export const time_binary = (): Binary => {
  const time = Date.now();
  const result = time.toString(2).padStart(TIME_LEN, "0");
  return result;
};

export const random_binary = (): Binary => {
  const arr1 = new BigUint64Array(1);
  self.crypto.getRandomValues(arr1);
  const crypto64 = arr1[0].toString(2).padStart(64, "0");
  const arr2 = new Uint16Array(1);
  self.crypto.getRandomValues(arr2);
  const crypto16 = arr2[0].toString(2).padStart(16, "0");
  return crypto64 + crypto16;
};

export const encode_base32 = (bin: Binary): Encoded => {
  if (bin?.length !== 128) {
    throw new Error("Invalid binary length: Should be 128.");
  }
  const filled_bin = "00" + bin;
  const buffer: string[] = new Array(26);
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

export const inc_binary = (bin: Binary): Binary => {
  const bin_reverse = bin!.split("").reverse();
  const zero_index = bin_reverse.indexOf("0");
  if (zero_index !== -1) {
    bin_reverse[zero_index] = "1";
    for (let i = 0; i < zero_index; i++) {
      bin_reverse[i] = "0";
    }
    return bin_reverse.reverse().join("");
  }
};
