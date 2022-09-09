const BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ULID_LEN = 26;
const TIME_LEN = 48;
const RAND_LEN = 80;

type binary = string | undefined;
type Encoded = string | undefined;

class Generator {
  prev_time: binary;
  prev_rand: binary;

  constructor() {
    {
      prev_time: undefined;
      prev_rand: undefined;
    }
  }

  join(): binary {
    if (this.prev_time === undefined || this.prev_rand === undefined) {
      return undefined;
    } else {
      return this.prev_time + this.prev_rand;
    }
  }

  ulid(): binary {
    if (this.prev_time === undefined) {
      this.prev_time = time_binary();
      this.prev_rand = random_binary();
      return this.join();
    } else {
      const new_time = time_binary();
      if (this.prev_time === new_time) {
        if (this.prev_rand === "1".repeat(RAND_LEN)) {
          return undefined;
        } else {
          this.prev_rand = inc_binary(this.prev_rand);
          return this.join();
        }
      } else {
        this.prev_time = new_time;
        this.prev_rand = random_binary();
        return this.join();
      }
    }
  }

  ulid_encoded(): binary {
    if (this.prev_time === undefined) {
      this.prev_time = time_binary();
      this.prev_rand = random_binary();
      return encode_base32(this.join());
    } else {
      const new_time = time_binary();
      if (this.prev_time === new_time) {
        if (this.prev_rand === "1".repeat(RAND_LEN)) {
          return undefined;
        } else {
          this.prev_rand = inc_binary(this.prev_rand);
          return encode_base32(this.join());
        }
      } else {
        this.prev_time = new_time;
        this.prev_rand = random_binary();
        return encode_base32(this.join());
      }
    }
  }
}

const time_binary = (): binary => {
  const time = Date.now();
  const result = time.toString(2).padStart(TIME_LEN, "0");
  return result;
};

const random_binary = (): binary => {
  const arr1 = new BigUint64Array(1);
  self.crypto.getRandomValues(arr1);
  const crypto64 = arr1[0].toString(2).padStart(64, "0");
  const arr2 = new Uint16Array(1);
  self.crypto.getRandomValues(arr2);
  const crypto16 = arr2[0].toString(2).padStart(16, "0");
  return crypto64 + crypto16;
};

const encode_base32 = (bin: binary): Encoded => {
  if (bin?.length !== 128) {
    return undefined;
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

const inc_binary = (bin: binary): binary => {
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

console.log(new Generator());
const gen = new Generator();
console.log(gen.ulid());
console.log(gen.ulid());
console.log(gen.ulid_encoded());
console.log(encode_base32(gen.ulid()));
