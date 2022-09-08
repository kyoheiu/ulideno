const BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ULID_LEN = 26;

type Ulid = string | undefined;

class Generator {
  previous: Ulid;

  constructor() {
    {
      previous: undefined;
    }
  }
}

const get_time_binary = (): string => {
  const time = BigInt(Date.now());
  const result = time.toString(2).padStart(48, "0");
  return result;
};

const random_binary = (): string => {
  const arr1 = new BigUint64Array(1);
  self.crypto.getRandomValues(arr1);
  const crypto64 = arr1[0].toString(2).padStart(64, "0");
  const arr2 = new Uint16Array(1);
  self.crypto.getRandomValues(arr2);
  const crypto16 = arr2[0].toString(2).padStart(16, "0");
  return crypto64 + crypto16;
};

const encode_base32 = (bin: string): string => {
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

export const ulid_as_binary = (): string => {
  return get_time_binary() + random_binary();
};

export const ulid = (): string => {
  return encode_base32(get_time_binary() + random_binary());
};

console.log(ulid_as_binary());
console.log(ulid());
