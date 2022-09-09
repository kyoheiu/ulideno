import {
  time_binary,
  random_binary,
  inc_binary,
  encode_base32,
} from "./functions.ts";

const RAND_LEN = 80;

export type Binary = string | undefined;
export type Encoded = string | undefined;

export class Generator {
  prev_time: Binary;
  prev_rand: Binary;

  constructor() {
    {
      prev_time: undefined;
      prev_rand: undefined;
    }
  }

  join(): Binary {
    if (this.prev_time === undefined || this.prev_rand === undefined) {
      return undefined;
    } else {
      return this.prev_time + this.prev_rand;
    }
  }

  ulid(): Binary {
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

  ulid_encoded(): Binary {
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
