import { time_binary, random_binary, encode_base32 } from "./functions.ts";

const RAND_MAX = (BigInt(1) << BigInt(80)) - BigInt(1);

export type Binary = string | undefined;
export type Encoded = string | undefined;

export class Generator {
  prev_time: bigint | undefined;
  prev_rand: bigint | undefined;

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
      const result = this.prev_time! | this.prev_rand!;
      return result.toString(2).padStart(128, "0");
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
        if (this.prev_rand === RAND_MAX) {
          throw new Error(
            "Random part reached max value: Cannot generate monotonic ulid."
          );
        } else {
          this.prev_rand = this.prev_rand! + BigInt(1);
          return this.join();
        }
      } else {
        this.prev_time = new_time;
        this.prev_rand = random_binary();
        return this.join();
      }
    }
  }

  ulid_encoded(): Encoded {
    if (this.prev_time === undefined) {
      this.prev_time = time_binary();
      this.prev_rand = random_binary();
      return encode_base32(this.join());
    } else {
      const new_time = time_binary();
      if (this.prev_time === new_time) {
        if (this.prev_rand === RAND_MAX) {
          throw new Error(
            "Random part reached max value: Cannot generate monotonic ulid."
          );
        } else {
          this.prev_rand = this.prev_rand! + BigInt(1);
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
