Simple [ULID](https://github.com/ulid/spec) implementation for deno.

## Usage

```ts
import {
  Generator,
  encode_base32,
} from "https://deno.land/x/ulideno@v0.2.0/mod.ts";

const gen = new Generator();
const ulid = gen.ulid();
const ulid_encoded = encode_base32(ulid);
const another_ulid_encoded = gen.ulid_encoded();
const yet_another = gen.ulid_encoded();
console.log(ulid, ulid_encoded, another_ulid_encoded, yet_another);
```

## Description

See `ulid_test.ts`.

```ts
import { Generator, encode_base32 } from "./mod.ts";

//example output: 01GCJ4PN0TW96EHC5GMEPMYHTV
Deno.test("generator test", () => {
  const gen = new Generator();
  const ulid = gen.ulid_encoded();
  assertEquals(ulid?.length, 26);
  console.log(gen.ulid_encoded());
});

//example output: 00000001100000110010010001001011010101000001111101010111000101110001011111001111000000110000001101011010001100100101000011101110
Deno.test("generator(binary) test", () => {
  const gen = new Generator();
  console.log(gen.ulid());
});

//example output:
//01GCJ4PN11ATG9JGRRA6QVYQJD
//01GCJ4PN11ATG9JGRRA6QVYQJE
Deno.test("monotonicity test", () => {
  const gen = new Generator();

  //If the same millisecond is detected, this expects to generate 2 ulids that has the same timestamp, and the random part is incremented by 1 bit.
  console.log(gen.ulid_encoded());
  console.log(gen.ulid_encoded());
});

//example output:
//01GCJ4PN146T2KF4WKBHH59SF6
//01GCJ4PN143Q0JDGEHPSX567DA
Deno.test("another generator test", () => {
  const gen1 = new Generator();
  console.log(gen1.ulid_encoded());
  //should generate a whole new ulid.
  const gen2 = new Generator();
  console.log(gen2.ulid_encoded());
});

Deno.test("encoding test", () => {
  const binary =
    "00000001100000110010010000100111111110010000111000000101001111111001101000010011101101110111000010111010101010010011110110101110";
  assertEquals(encode_base32(binary), "01GCJ2FY8E0MZSM4XQE2XAJFDE");
});

Deno.test("wrap test", () => {
  let gen = new Generator();
  gen.prev_time = time_binary();
  //When the random component is going to overflow...
  gen.prev_rand = (BigInt(1) << BigInt(80)) - BigInt(2);
  //It is wrapped around to 0.
  //i.e.
  //01GNMY86NAZZZZZZZZZZZZZZZZ
  //01GNMY86NA0000000000000000
  console.log(gen.ulid_encoded());
  console.log(gen.ulid_encoded());
});
```
