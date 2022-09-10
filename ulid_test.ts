// url_test.ts
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { Generator, encode_base32 } from "./mod.ts";

Deno.test("generator test", () => {
  const gen = new Generator();
  const ulid = gen.ulid_encoded();
  assertEquals(ulid?.length, 26);
  console.log(gen.ulid_encoded());
});

Deno.test("generator(binary) test", () => {
  const gen = new Generator();
  console.log(gen.ulid());
});

Deno.test("monotonicity test", () => {
  const gen = new Generator();

  //If the same millisecond is detected, this expects to generate 2 ulids that has the same timestamp, and the random part is incremented by 1 bit.
  console.log(gen.ulid_encoded());
  console.log(gen.ulid_encoded());
});

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

Deno.test("encoding error test", () => {
  const wrong_binary =
    "0000001100000110010010000100111111110010000111000000101001111111001101000010011101101110111000010111010101010010011110110101110";
  assertThrows(() => encode_base32(wrong_binary));
});

Deno.test("BigInt test", () => {
  assertEquals(
    ((BigInt(1) << BigInt(80)) - BigInt(1)).toString(2),
    "11111111111111111111111111111111111111111111111111111111111111111111111111111111"
  );
});
