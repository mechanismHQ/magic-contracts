export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { "string-ascii": { length: number } };
export type ClarityAbiTypeStringUtf8 = { "string-utf8": { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: readonly { name: string; type: ClarityAbiType }[];
};
export type ClarityAbiTypeList = {
  list: { type: ClarityAbiType; length: number };
};

export type ClarityAbiTypeUInt128 = "uint128";
export type ClarityAbiTypeInt128 = "int128";
export type ClarityAbiTypeBool = "bool";
export type ClarityAbiTypePrincipal = "principal";
export type ClarityAbiTypeTraitReference = "trait_reference";
export type ClarityAbiTypeNone = "none";

export type ClarityAbiTypePrimitive =
  | ClarityAbiTypeUInt128
  | ClarityAbiTypeInt128
  | ClarityAbiTypeBool
  | ClarityAbiTypePrincipal
  | ClarityAbiTypeTraitReference
  | ClarityAbiTypeNone;

export type ClarityAbiType =
  | ClarityAbiTypePrimitive
  | ClarityAbiTypeBuffer
  | ClarityAbiTypeResponse
  | ClarityAbiTypeOptional
  | ClarityAbiTypeTuple
  | ClarityAbiTypeList
  | ClarityAbiTypeStringAscii
  | ClarityAbiTypeStringUtf8
  | ClarityAbiTypeTraitReference;

export interface ClarityAbiArg {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbiFunction {
  name: string;
  access: "private" | "public" | "read_only";
  args: ClarityAbiArg[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiArg<T, N extends string> = { _t?: T; name: N };

export type TypedAbiFunction<T extends TypedAbiArg<unknown, string>[], R> =
  & ClarityAbiFunction
  & {
    _t?: T;
    _r?: R;
  };

export interface ClarityAbiVariable {
  name: string;
  access: "variable" | "constant";
  type: ClarityAbiType;
}

export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export type TypedAbiMap<K, V> = ClarityAbiMap & {
  _k?: K;
  _v?: V;
};

export interface ClarityAbiTypeFungibleToken {
  name: string;
}

export interface ClarityAbiTypeNonFungibleToken<T = unknown> {
  name: string;
  type: ClarityAbiType;
  _t?: T;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: readonly ClarityAbiTypeNonFungibleToken<unknown>[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<TypedAbiArg<unknown, string>[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
    [key: string]: unknown;
  };
  fungible_tokens: Readonly<ClarityAbiTypeFungibleToken[]>;
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken<unknown>[]>;
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
  _e?: E;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
  _o?: T;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export const contracts = {
  clarityBitcoin: {
    "functions": {
      buffToU8: {
        "name": "buff-to-u8",
        "access": "read_only",
        "args": [{ "name": "byte", "type": { "buffer": { "length": 1 } } }],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[byte: TypedAbiArg<Uint8Array, "byte">], bigint>,
      getReversedTxid: {
        "name": "get-reversed-txid",
        "access": "read_only",
        "args": [{ "name": "tx", "type": { "buffer": { "length": 1024 } } }],
        "outputs": { "type": { "buffer": { "length": 32 } } },
      } as TypedAbiFunction<[tx: TypedAbiArg<Uint8Array, "tx">], Uint8Array>,
      getTxid: {
        "name": "get-txid",
        "access": "read_only",
        "args": [{ "name": "tx", "type": { "buffer": { "length": 1024 } } }],
        "outputs": { "type": { "buffer": { "length": 32 } } },
      } as TypedAbiFunction<[tx: TypedAbiArg<Uint8Array, "tx">], Uint8Array>,
      innerBuff32Permutation: {
        "name": "inner-buff32-permutation",
        "access": "read_only",
        "args": [{ "name": "target-index", "type": "uint128" }, {
          "name": "state",
          "type": {
            "tuple": [{
              "name": "hash-input",
              "type": { "buffer": { "length": 32 } },
            }, {
              "name": "hash-output",
              "type": { "buffer": { "length": 32 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "tuple": [{
              "name": "hash-input",
              "type": { "buffer": { "length": 32 } },
            }, {
              "name": "hash-output",
              "type": { "buffer": { "length": 32 } },
            }],
          },
        },
      } as TypedAbiFunction<
        [
          targetIndex: TypedAbiArg<number | bigint, "targetIndex">,
          state: TypedAbiArg<{
            "hashInput": Uint8Array;
            "hashOutput": Uint8Array;
          }, "state">,
        ],
        {
          "hashInput": Uint8Array;
          "hashOutput": Uint8Array;
        }
      >,
      innerMerkleProofVerify: {
        "name": "inner-merkle-proof-verify",
        "access": "read_only",
        "args": [{ "name": "ctr", "type": "uint128" }, {
          "name": "state",
          "type": {
            "tuple": [
              { "name": "cur-hash", "type": { "buffer": { "length": 32 } } },
              { "name": "path", "type": "uint128" },
              {
                "name": "proof-hashes",
                "type": {
                  "list": {
                    "type": { "buffer": { "length": 32 } },
                    "length": 20,
                  },
                },
              },
              { "name": "root-hash", "type": { "buffer": { "length": 32 } } },
              { "name": "tree-depth", "type": "uint128" },
              { "name": "verified", "type": "bool" },
            ],
          },
        }],
        "outputs": {
          "type": {
            "tuple": [
              { "name": "cur-hash", "type": { "buffer": { "length": 32 } } },
              { "name": "path", "type": "uint128" },
              {
                "name": "proof-hashes",
                "type": {
                  "list": {
                    "type": { "buffer": { "length": 32 } },
                    "length": 20,
                  },
                },
              },
              { "name": "root-hash", "type": { "buffer": { "length": 32 } } },
              { "name": "tree-depth", "type": "uint128" },
              { "name": "verified", "type": "bool" },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          ctr: TypedAbiArg<number | bigint, "ctr">,
          state: TypedAbiArg<{
            "curHash": Uint8Array;
            "path": number | bigint;
            "proofHashes": Uint8Array[];
            "rootHash": Uint8Array;
            "treeDepth": number | bigint;
            "verified": boolean;
          }, "state">,
        ],
        {
          "curHash": Uint8Array;
          "path": bigint;
          "proofHashes": Uint8Array[];
          "rootHash": Uint8Array;
          "treeDepth": bigint;
          "verified": boolean;
        }
      >,
      innerReadSlice: {
        "name": "inner-read-slice",
        "access": "read_only",
        "args": [{ "name": "chunk_size", "type": "uint128" }, {
          "name": "input",
          "type": {
            "tuple": [
              { "name": "acc", "type": { "buffer": { "length": 1024 } } },
              { "name": "buffer", "type": { "buffer": { "length": 1024 } } },
              { "name": "index", "type": "uint128" },
              { "name": "remaining", "type": "uint128" },
            ],
          },
        }],
        "outputs": {
          "type": {
            "tuple": [
              { "name": "acc", "type": { "buffer": { "length": 1024 } } },
              { "name": "buffer", "type": { "buffer": { "length": 1024 } } },
              { "name": "index", "type": "uint128" },
              { "name": "remaining", "type": "uint128" },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          chunk_size: TypedAbiArg<number | bigint, "chunk_size">,
          input: TypedAbiArg<{
            "acc": Uint8Array;
            "buffer": Uint8Array;
            "index": number | bigint;
            "remaining": number | bigint;
          }, "input">,
        ],
        {
          "acc": Uint8Array;
          "buffer": Uint8Array;
          "index": bigint;
          "remaining": bigint;
        }
      >,
      innerReadSlice1024: {
        "name": "inner-read-slice-1024",
        "access": "read_only",
        "args": [{ "name": "ignored", "type": "bool" }, {
          "name": "input",
          "type": {
            "tuple": [
              { "name": "acc", "type": { "buffer": { "length": 1024 } } },
              { "name": "data", "type": { "buffer": { "length": 1024 } } },
              { "name": "index", "type": "uint128" },
            ],
          },
        }],
        "outputs": {
          "type": {
            "tuple": [
              { "name": "acc", "type": { "buffer": { "length": 1024 } } },
              { "name": "data", "type": { "buffer": { "length": 1024 } } },
              { "name": "index", "type": "uint128" },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          ignored: TypedAbiArg<boolean, "ignored">,
          input: TypedAbiArg<{
            "acc": Uint8Array;
            "data": Uint8Array;
            "index": number | bigint;
          }, "input">,
        ],
        {
          "acc": Uint8Array;
          "data": Uint8Array;
          "index": bigint;
        }
      >,
      isBitSet: {
        "name": "is-bit-set",
        "access": "read_only",
        "args": [{ "name": "val", "type": "uint128" }, {
          "name": "bit",
          "type": "uint128",
        }],
        "outputs": { "type": "bool" },
      } as TypedAbiFunction<
        [
          val: TypedAbiArg<number | bigint, "val">,
          bit: TypedAbiArg<number | bigint, "bit">,
        ],
        boolean
      >,
      parseBlockHeader: {
        "name": "parse-block-header",
        "access": "read_only",
        "args": [{
          "name": "headerbuff",
          "type": { "buffer": { "length": 80 } },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  {
                    "name": "merkle-root",
                    "type": { "buffer": { "length": 32 } },
                  },
                  { "name": "nbits", "type": "uint128" },
                  { "name": "nonce", "type": "uint128" },
                  { "name": "parent", "type": { "buffer": { "length": 32 } } },
                  { "name": "timestamp", "type": "uint128" },
                  { "name": "version", "type": "uint128" },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [headerbuff: TypedAbiArg<Uint8Array, "headerbuff">],
        Response<{
          "merkleRoot": Uint8Array;
          "nbits": bigint;
          "nonce": bigint;
          "parent": Uint8Array;
          "timestamp": bigint;
          "version": bigint;
        }, bigint>
      >,
      parseTx: {
        "name": "parse-tx",
        "access": "read_only",
        "args": [{ "name": "tx", "type": { "buffer": { "length": 1024 } } }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  {
                    "name": "ins",
                    "type": {
                      "list": {
                        "type": {
                          "tuple": [{
                            "name": "outpoint",
                            "type": {
                              "tuple": [{
                                "name": "hash",
                                "type": { "buffer": { "length": 32 } },
                              }, { "name": "index", "type": "uint128" }],
                            },
                          }, {
                            "name": "scriptSig",
                            "type": { "buffer": { "length": 256 } },
                          }, { "name": "sequence", "type": "uint128" }],
                        },
                        "length": 8,
                      },
                    },
                  },
                  { "name": "locktime", "type": "uint128" },
                  {
                    "name": "outs",
                    "type": {
                      "list": {
                        "type": {
                          "tuple": [{
                            "name": "scriptPubKey",
                            "type": { "buffer": { "length": 128 } },
                          }, { "name": "value", "type": "uint128" }],
                        },
                        "length": 8,
                      },
                    },
                  },
                  { "name": "version", "type": "uint128" },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [tx: TypedAbiArg<Uint8Array, "tx">],
        Response<{
          "ins": {
            "outpoint": {
              "hash": Uint8Array;
              "index": bigint;
            };
            "scriptSig": Uint8Array;
            "sequence": bigint;
          }[];
          "locktime": bigint;
          "outs": {
            "scriptPubKey": Uint8Array;
            "value": bigint;
          }[];
          "version": bigint;
        }, bigint>
      >,
      readHashslice: {
        "name": "read-hashslice",
        "access": "read_only",
        "args": [{
          "name": "old-ctx",
          "type": {
            "tuple": [{ "name": "index", "type": "uint128" }, {
              "name": "txbuff",
              "type": { "buffer": { "length": 1024 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [{
                  "name": "ctx",
                  "type": {
                    "tuple": [{ "name": "index", "type": "uint128" }, {
                      "name": "txbuff",
                      "type": { "buffer": { "length": 1024 } },
                    }],
                  },
                }, {
                  "name": "hashslice",
                  "type": { "buffer": { "length": 32 } },
                }],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          oldCtx: TypedAbiArg<{
            "index": number | bigint;
            "txbuff": Uint8Array;
          }, "oldCtx">,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "hashslice": Uint8Array;
        }, bigint>
      >,
      readNextTxin: {
        "name": "read-next-txin",
        "access": "read_only",
        "args": [{ "name": "ignored", "type": "bool" }, {
          "name": "state-res",
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  {
                    "name": "ctx",
                    "type": {
                      "tuple": [{ "name": "index", "type": "uint128" }, {
                        "name": "txbuff",
                        "type": { "buffer": { "length": 1024 } },
                      }],
                    },
                  },
                  { "name": "remaining", "type": "uint128" },
                  {
                    "name": "txins",
                    "type": {
                      "list": {
                        "type": {
                          "tuple": [{
                            "name": "outpoint",
                            "type": {
                              "tuple": [{
                                "name": "hash",
                                "type": { "buffer": { "length": 32 } },
                              }, { "name": "index", "type": "uint128" }],
                            },
                          }, {
                            "name": "scriptSig",
                            "type": { "buffer": { "length": 256 } },
                          }, { "name": "sequence", "type": "uint128" }],
                        },
                        "length": 8,
                      },
                    },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  {
                    "name": "ctx",
                    "type": {
                      "tuple": [{ "name": "index", "type": "uint128" }, {
                        "name": "txbuff",
                        "type": { "buffer": { "length": 1024 } },
                      }],
                    },
                  },
                  { "name": "remaining", "type": "uint128" },
                  {
                    "name": "txins",
                    "type": {
                      "list": {
                        "type": {
                          "tuple": [{
                            "name": "outpoint",
                            "type": {
                              "tuple": [{
                                "name": "hash",
                                "type": { "buffer": { "length": 32 } },
                              }, { "name": "index", "type": "uint128" }],
                            },
                          }, {
                            "name": "scriptSig",
                            "type": { "buffer": { "length": 256 } },
                          }, { "name": "sequence", "type": "uint128" }],
                        },
                        "length": 8,
                      },
                    },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          ignored: TypedAbiArg<boolean, "ignored">,
          stateRes: TypedAbiArg<
            Response<{
              "ctx": {
                "index": number | bigint;
                "txbuff": Uint8Array;
              };
              "remaining": number | bigint;
              "txins": {
                "outpoint": {
                  "hash": Uint8Array;
                  "index": number | bigint;
                };
                "scriptSig": Uint8Array;
                "sequence": number | bigint;
              }[];
            }, number | bigint>,
            "stateRes"
          >,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "remaining": bigint;
          "txins": {
            "outpoint": {
              "hash": Uint8Array;
              "index": bigint;
            };
            "scriptSig": Uint8Array;
            "sequence": bigint;
          }[];
        }, bigint>
      >,
      readNextTxout: {
        "name": "read-next-txout",
        "access": "read_only",
        "args": [{ "name": "ignored", "type": "bool" }, {
          "name": "state-res",
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  {
                    "name": "ctx",
                    "type": {
                      "tuple": [{ "name": "index", "type": "uint128" }, {
                        "name": "txbuff",
                        "type": { "buffer": { "length": 1024 } },
                      }],
                    },
                  },
                  { "name": "remaining", "type": "uint128" },
                  {
                    "name": "txouts",
                    "type": {
                      "list": {
                        "type": {
                          "tuple": [{
                            "name": "scriptPubKey",
                            "type": { "buffer": { "length": 128 } },
                          }, { "name": "value", "type": "uint128" }],
                        },
                        "length": 8,
                      },
                    },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  {
                    "name": "ctx",
                    "type": {
                      "tuple": [{ "name": "index", "type": "uint128" }, {
                        "name": "txbuff",
                        "type": { "buffer": { "length": 1024 } },
                      }],
                    },
                  },
                  { "name": "remaining", "type": "uint128" },
                  {
                    "name": "txouts",
                    "type": {
                      "list": {
                        "type": {
                          "tuple": [{
                            "name": "scriptPubKey",
                            "type": { "buffer": { "length": 128 } },
                          }, { "name": "value", "type": "uint128" }],
                        },
                        "length": 8,
                      },
                    },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          ignored: TypedAbiArg<boolean, "ignored">,
          stateRes: TypedAbiArg<
            Response<{
              "ctx": {
                "index": number | bigint;
                "txbuff": Uint8Array;
              };
              "remaining": number | bigint;
              "txouts": {
                "scriptPubKey": Uint8Array;
                "value": number | bigint;
              }[];
            }, number | bigint>,
            "stateRes"
          >,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "remaining": bigint;
          "txouts": {
            "scriptPubKey": Uint8Array;
            "value": bigint;
          }[];
        }, bigint>
      >,
      readSlice: {
        "name": "read-slice",
        "access": "read_only",
        "args": [{ "name": "data", "type": { "buffer": { "length": 1024 } } }, {
          "name": "offset",
          "type": "uint128",
        }, { "name": "size", "type": "uint128" }],
        "outputs": {
          "type": {
            "response": {
              "ok": { "buffer": { "length": 1024 } },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          data: TypedAbiArg<Uint8Array, "data">,
          offset: TypedAbiArg<number | bigint, "offset">,
          size: TypedAbiArg<number | bigint, "size">,
        ],
        Response<Uint8Array, bigint>
      >,
      readSlice1: {
        "name": "read-slice-1",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice128: {
        "name": "read-slice-128",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice16: {
        "name": "read-slice-16",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice2: {
        "name": "read-slice-2",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice256: {
        "name": "read-slice-256",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice32: {
        "name": "read-slice-32",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice4: {
        "name": "read-slice-4",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice512: {
        "name": "read-slice-512",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice64: {
        "name": "read-slice-64",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readSlice8: {
        "name": "read-slice-8",
        "access": "read_only",
        "args": [{
          "name": "input",
          "type": {
            "tuple": [{
              "name": "data",
              "type": { "buffer": { "length": 1024 } },
            }, { "name": "index", "type": "uint128" }],
          },
        }],
        "outputs": { "type": { "buffer": { "length": 1024 } } },
      } as TypedAbiFunction<[
        input: TypedAbiArg<{
          "data": Uint8Array;
          "index": number | bigint;
        }, "input">,
      ], Uint8Array>,
      readTxins: {
        "name": "read-txins",
        "access": "read_only",
        "args": [{
          "name": "ctx",
          "type": {
            "tuple": [{ "name": "index", "type": "uint128" }, {
              "name": "txbuff",
              "type": { "buffer": { "length": 1024 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  {
                    "name": "ctx",
                    "type": {
                      "tuple": [{ "name": "index", "type": "uint128" }, {
                        "name": "txbuff",
                        "type": { "buffer": { "length": 1024 } },
                      }],
                    },
                  },
                  { "name": "remaining", "type": "uint128" },
                  {
                    "name": "txins",
                    "type": {
                      "list": {
                        "type": {
                          "tuple": [{
                            "name": "outpoint",
                            "type": {
                              "tuple": [{
                                "name": "hash",
                                "type": { "buffer": { "length": 32 } },
                              }, { "name": "index", "type": "uint128" }],
                            },
                          }, {
                            "name": "scriptSig",
                            "type": { "buffer": { "length": 256 } },
                          }, { "name": "sequence", "type": "uint128" }],
                        },
                        "length": 8,
                      },
                    },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: TypedAbiArg<{
            "index": number | bigint;
            "txbuff": Uint8Array;
          }, "ctx">,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "remaining": bigint;
          "txins": {
            "outpoint": {
              "hash": Uint8Array;
              "index": bigint;
            };
            "scriptSig": Uint8Array;
            "sequence": bigint;
          }[];
        }, bigint>
      >,
      readTxouts: {
        "name": "read-txouts",
        "access": "read_only",
        "args": [{
          "name": "ctx",
          "type": {
            "tuple": [{ "name": "index", "type": "uint128" }, {
              "name": "txbuff",
              "type": { "buffer": { "length": 1024 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  {
                    "name": "ctx",
                    "type": {
                      "tuple": [{ "name": "index", "type": "uint128" }, {
                        "name": "txbuff",
                        "type": { "buffer": { "length": 1024 } },
                      }],
                    },
                  },
                  { "name": "remaining", "type": "uint128" },
                  {
                    "name": "txouts",
                    "type": {
                      "list": {
                        "type": {
                          "tuple": [{
                            "name": "scriptPubKey",
                            "type": { "buffer": { "length": 128 } },
                          }, { "name": "value", "type": "uint128" }],
                        },
                        "length": 8,
                      },
                    },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: TypedAbiArg<{
            "index": number | bigint;
            "txbuff": Uint8Array;
          }, "ctx">,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "remaining": bigint;
          "txouts": {
            "scriptPubKey": Uint8Array;
            "value": bigint;
          }[];
        }, bigint>
      >,
      readUint16: {
        "name": "read-uint16",
        "access": "read_only",
        "args": [{
          "name": "ctx",
          "type": {
            "tuple": [{ "name": "index", "type": "uint128" }, {
              "name": "txbuff",
              "type": { "buffer": { "length": 1024 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [{
                  "name": "ctx",
                  "type": {
                    "tuple": [{ "name": "index", "type": "uint128" }, {
                      "name": "txbuff",
                      "type": { "buffer": { "length": 1024 } },
                    }],
                  },
                }, { "name": "uint16", "type": "uint128" }],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: TypedAbiArg<{
            "index": number | bigint;
            "txbuff": Uint8Array;
          }, "ctx">,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "uint16": bigint;
        }, bigint>
      >,
      readUint32: {
        "name": "read-uint32",
        "access": "read_only",
        "args": [{
          "name": "ctx",
          "type": {
            "tuple": [{ "name": "index", "type": "uint128" }, {
              "name": "txbuff",
              "type": { "buffer": { "length": 1024 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [{
                  "name": "ctx",
                  "type": {
                    "tuple": [{ "name": "index", "type": "uint128" }, {
                      "name": "txbuff",
                      "type": { "buffer": { "length": 1024 } },
                    }],
                  },
                }, { "name": "uint32", "type": "uint128" }],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: TypedAbiArg<{
            "index": number | bigint;
            "txbuff": Uint8Array;
          }, "ctx">,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "uint32": bigint;
        }, bigint>
      >,
      readUint64: {
        "name": "read-uint64",
        "access": "read_only",
        "args": [{
          "name": "ctx",
          "type": {
            "tuple": [{ "name": "index", "type": "uint128" }, {
              "name": "txbuff",
              "type": { "buffer": { "length": 1024 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [{
                  "name": "ctx",
                  "type": {
                    "tuple": [{ "name": "index", "type": "uint128" }, {
                      "name": "txbuff",
                      "type": { "buffer": { "length": 1024 } },
                    }],
                  },
                }, { "name": "uint64", "type": "uint128" }],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: TypedAbiArg<{
            "index": number | bigint;
            "txbuff": Uint8Array;
          }, "ctx">,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "uint64": bigint;
        }, bigint>
      >,
      readVarint: {
        "name": "read-varint",
        "access": "read_only",
        "args": [{
          "name": "ctx",
          "type": {
            "tuple": [{ "name": "index", "type": "uint128" }, {
              "name": "txbuff",
              "type": { "buffer": { "length": 1024 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [{
                  "name": "ctx",
                  "type": {
                    "tuple": [{ "name": "index", "type": "uint128" }, {
                      "name": "txbuff",
                      "type": { "buffer": { "length": 1024 } },
                    }],
                  },
                }, { "name": "varint", "type": "uint128" }],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: TypedAbiArg<{
            "index": number | bigint;
            "txbuff": Uint8Array;
          }, "ctx">,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "varint": bigint;
        }, bigint>
      >,
      readVarslice: {
        "name": "read-varslice",
        "access": "read_only",
        "args": [{
          "name": "old-ctx",
          "type": {
            "tuple": [{ "name": "index", "type": "uint128" }, {
              "name": "txbuff",
              "type": { "buffer": { "length": 1024 } },
            }],
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [{
                  "name": "ctx",
                  "type": {
                    "tuple": [{ "name": "index", "type": "uint128" }, {
                      "name": "txbuff",
                      "type": { "buffer": { "length": 1024 } },
                    }],
                  },
                }, {
                  "name": "varslice",
                  "type": { "buffer": { "length": 1024 } },
                }],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          oldCtx: TypedAbiArg<{
            "index": number | bigint;
            "txbuff": Uint8Array;
          }, "oldCtx">,
        ],
        Response<{
          "ctx": {
            "index": bigint;
            "txbuff": Uint8Array;
          };
          "varslice": Uint8Array;
        }, bigint>
      >,
      reverseBuff32: {
        "name": "reverse-buff32",
        "access": "read_only",
        "args": [{ "name": "input", "type": { "buffer": { "length": 32 } } }],
        "outputs": { "type": { "buffer": { "length": 32 } } },
      } as TypedAbiFunction<
        [input: TypedAbiArg<Uint8Array, "input">],
        Uint8Array
      >,
      verifyBlockHeader: {
        "name": "verify-block-header",
        "access": "read_only",
        "args": [{
          "name": "headerbuff",
          "type": { "buffer": { "length": 80 } },
        }, { "name": "expected-block-height", "type": "uint128" }],
        "outputs": { "type": "bool" },
      } as TypedAbiFunction<
        [
          headerbuff: TypedAbiArg<Uint8Array, "headerbuff">,
          expectedBlockHeight: TypedAbiArg<
            number | bigint,
            "expectedBlockHeight"
          >,
        ],
        boolean
      >,
      verifyMerkleProof: {
        "name": "verify-merkle-proof",
        "access": "read_only",
        "args": [
          { "name": "reversed-txid", "type": { "buffer": { "length": 32 } } },
          { "name": "merkle-root", "type": { "buffer": { "length": 32 } } },
          {
            "name": "proof",
            "type": {
              "tuple": [
                {
                  "name": "hashes",
                  "type": {
                    "list": {
                      "type": { "buffer": { "length": 32 } },
                      "length": 20,
                    },
                  },
                },
                { "name": "tree-depth", "type": "uint128" },
                { "name": "tx-index", "type": "uint128" },
              ],
            },
          },
        ],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          reversedTxid: TypedAbiArg<Uint8Array, "reversedTxid">,
          merkleRoot: TypedAbiArg<Uint8Array, "merkleRoot">,
          proof: TypedAbiArg<{
            "hashes": Uint8Array[];
            "treeDepth": number | bigint;
            "txIndex": number | bigint;
          }, "proof">,
        ],
        Response<boolean, bigint>
      >,
      verifyPrevBlock: {
        "name": "verify-prev-block",
        "access": "read_only",
        "args": [{ "name": "block", "type": { "buffer": { "length": 80 } } }, {
          "name": "parent",
          "type": { "buffer": { "length": 80 } },
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          block: TypedAbiArg<Uint8Array, "block">,
          parent: TypedAbiArg<Uint8Array, "parent">,
        ],
        Response<boolean, bigint>
      >,
      verifyPrevBlocks: {
        "name": "verify-prev-blocks",
        "access": "read_only",
        "args": [{ "name": "block", "type": { "buffer": { "length": 80 } } }, {
          "name": "prev-blocks",
          "type": {
            "list": { "type": { "buffer": { "length": 80 } }, "length": 10 },
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": { "buffer": { "length": 80 } },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          block: TypedAbiArg<Uint8Array, "block">,
          prevBlocks: TypedAbiArg<Uint8Array[], "prevBlocks">,
        ],
        Response<Uint8Array, bigint>
      >,
      verifyPrevBlocksFold: {
        "name": "verify-prev-blocks-fold",
        "access": "read_only",
        "args": [{ "name": "parent", "type": { "buffer": { "length": 80 } } }, {
          "name": "next-resp",
          "type": {
            "response": {
              "ok": { "buffer": { "length": 80 } },
              "error": "uint128",
            },
          },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": { "buffer": { "length": 80 } },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          parent: TypedAbiArg<Uint8Array, "parent">,
          nextResp: TypedAbiArg<
            Response<Uint8Array, number | bigint>,
            "nextResp"
          >,
        ],
        Response<Uint8Array, bigint>
      >,
      wasTxMinedPrev: {
        "name": "was-tx-mined-prev?",
        "access": "read_only",
        "args": [
          {
            "name": "block",
            "type": {
              "tuple": [{
                "name": "header",
                "type": { "buffer": { "length": 80 } },
              }, { "name": "height", "type": "uint128" }],
            },
          },
          {
            "name": "prev-blocks",
            "type": {
              "list": { "type": { "buffer": { "length": 80 } }, "length": 10 },
            },
          },
          { "name": "tx", "type": { "buffer": { "length": 1024 } } },
          {
            "name": "proof",
            "type": {
              "tuple": [
                {
                  "name": "hashes",
                  "type": {
                    "list": {
                      "type": { "buffer": { "length": 32 } },
                      "length": 20,
                    },
                  },
                },
                { "name": "tree-depth", "type": "uint128" },
                { "name": "tx-index", "type": "uint128" },
              ],
            },
          },
        ],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<[
        block: TypedAbiArg<{
          "header": Uint8Array;
          "height": number | bigint;
        }, "block">,
        prevBlocks: TypedAbiArg<Uint8Array[], "prevBlocks">,
        tx: TypedAbiArg<Uint8Array, "tx">,
        proof: TypedAbiArg<{
          "hashes": Uint8Array[];
          "treeDepth": number | bigint;
          "txIndex": number | bigint;
        }, "proof">,
      ], Response<boolean, bigint>>,
      wasTxMined: {
        "name": "was-tx-mined?",
        "access": "read_only",
        "args": [
          {
            "name": "block",
            "type": {
              "tuple": [{
                "name": "header",
                "type": { "buffer": { "length": 80 } },
              }, { "name": "height", "type": "uint128" }],
            },
          },
          { "name": "tx", "type": { "buffer": { "length": 1024 } } },
          {
            "name": "proof",
            "type": {
              "tuple": [
                {
                  "name": "hashes",
                  "type": {
                    "list": {
                      "type": { "buffer": { "length": 32 } },
                      "length": 20,
                    },
                  },
                },
                { "name": "tree-depth", "type": "uint128" },
                { "name": "tx-index", "type": "uint128" },
              ],
            },
          },
        ],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<[
        block: TypedAbiArg<{
          "header": Uint8Array;
          "height": number | bigint;
        }, "block">,
        tx: TypedAbiArg<Uint8Array, "tx">,
        proof: TypedAbiArg<{
          "hashes": Uint8Array[];
          "treeDepth": number | bigint;
          "txIndex": number | bigint;
        }, "proof">,
      ], Response<boolean, bigint>>,
    },
    "maps": {},
    "variables": {
      BUFF_TO_BYTE: {
        name: "BUFF_TO_BYTE",
        type: {
          list: {
            type: {
              buffer: {
                length: 1,
              },
            },
            length: 256,
          },
        },
        access: "constant",
      } as TypedAbiVariable<Uint8Array[]>,
      ERR_BAD_HEADER: {
        name: "ERR-BAD-HEADER",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      ERR_INVALID_PARENT: {
        name: "ERR-INVALID-PARENT",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      ERR_OUT_OF_BOUNDS: {
        name: "ERR-OUT-OF-BOUNDS",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      ERR_PROOF_TOO_SHORT: {
        name: "ERR-PROOF-TOO-SHORT",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      ERR_TOO_MANY_TXINS: {
        name: "ERR-TOO-MANY-TXINS",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      ERR_TOO_MANY_TXOUTS: {
        name: "ERR-TOO-MANY-TXOUTS",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      ERR_VARSLICE_TOO_LONG: {
        name: "ERR-VARSLICE-TOO-LONG",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      lIST_128: {
        name: "LIST_128",
        type: {
          list: {
            type: "bool",
            length: 128,
          },
        },
        access: "constant",
      } as TypedAbiVariable<boolean[]>,
      lIST_16: {
        name: "LIST_16",
        type: {
          list: {
            type: "bool",
            length: 16,
          },
        },
        access: "constant",
      } as TypedAbiVariable<boolean[]>,
      lIST_256: {
        name: "LIST_256",
        type: {
          list: {
            type: "bool",
            length: 256,
          },
        },
        access: "constant",
      } as TypedAbiVariable<boolean[]>,
      lIST_32: {
        name: "LIST_32",
        type: {
          list: {
            type: "bool",
            length: 32,
          },
        },
        access: "constant",
      } as TypedAbiVariable<boolean[]>,
      lIST_512: {
        name: "LIST_512",
        type: {
          list: {
            type: "bool",
            length: 512,
          },
        },
        access: "constant",
      } as TypedAbiVariable<boolean[]>,
      lIST_64: {
        name: "LIST_64",
        type: {
          list: {
            type: "bool",
            length: 64,
          },
        },
        access: "constant",
      } as TypedAbiVariable<boolean[]>,
    },
    constants: {
      BUFF_TO_BYTE: [
        Uint8Array.from([0]),
        Uint8Array.from([1]),
        Uint8Array.from([2]),
        Uint8Array.from([3]),
        Uint8Array.from([4]),
        Uint8Array.from([5]),
        Uint8Array.from([6]),
        Uint8Array.from([7]),
        Uint8Array.from([8]),
        Uint8Array.from([9]),
        Uint8Array.from([10]),
        Uint8Array.from([11]),
        Uint8Array.from([12]),
        Uint8Array.from([13]),
        Uint8Array.from([14]),
        Uint8Array.from([15]),
        Uint8Array.from([16]),
        Uint8Array.from([17]),
        Uint8Array.from([18]),
        Uint8Array.from([19]),
        Uint8Array.from([20]),
        Uint8Array.from([21]),
        Uint8Array.from([22]),
        Uint8Array.from([23]),
        Uint8Array.from([24]),
        Uint8Array.from([25]),
        Uint8Array.from([26]),
        Uint8Array.from([27]),
        Uint8Array.from([28]),
        Uint8Array.from([29]),
        Uint8Array.from([30]),
        Uint8Array.from([31]),
        Uint8Array.from([32]),
        Uint8Array.from([33]),
        Uint8Array.from([34]),
        Uint8Array.from([35]),
        Uint8Array.from([36]),
        Uint8Array.from([37]),
        Uint8Array.from([38]),
        Uint8Array.from([39]),
        Uint8Array.from([40]),
        Uint8Array.from([41]),
        Uint8Array.from([42]),
        Uint8Array.from([43]),
        Uint8Array.from([44]),
        Uint8Array.from([45]),
        Uint8Array.from([46]),
        Uint8Array.from([47]),
        Uint8Array.from([48]),
        Uint8Array.from([49]),
        Uint8Array.from([50]),
        Uint8Array.from([51]),
        Uint8Array.from([52]),
        Uint8Array.from([53]),
        Uint8Array.from([54]),
        Uint8Array.from([55]),
        Uint8Array.from([56]),
        Uint8Array.from([57]),
        Uint8Array.from([58]),
        Uint8Array.from([59]),
        Uint8Array.from([60]),
        Uint8Array.from([61]),
        Uint8Array.from([62]),
        Uint8Array.from([63]),
        Uint8Array.from([64]),
        Uint8Array.from([65]),
        Uint8Array.from([66]),
        Uint8Array.from([67]),
        Uint8Array.from([68]),
        Uint8Array.from([69]),
        Uint8Array.from([70]),
        Uint8Array.from([71]),
        Uint8Array.from([72]),
        Uint8Array.from([73]),
        Uint8Array.from([74]),
        Uint8Array.from([75]),
        Uint8Array.from([76]),
        Uint8Array.from([77]),
        Uint8Array.from([78]),
        Uint8Array.from([79]),
        Uint8Array.from([80]),
        Uint8Array.from([81]),
        Uint8Array.from([82]),
        Uint8Array.from([83]),
        Uint8Array.from([84]),
        Uint8Array.from([85]),
        Uint8Array.from([86]),
        Uint8Array.from([87]),
        Uint8Array.from([88]),
        Uint8Array.from([89]),
        Uint8Array.from([90]),
        Uint8Array.from([91]),
        Uint8Array.from([92]),
        Uint8Array.from([93]),
        Uint8Array.from([94]),
        Uint8Array.from([95]),
        Uint8Array.from([96]),
        Uint8Array.from([97]),
        Uint8Array.from([98]),
        Uint8Array.from([99]),
        Uint8Array.from([100]),
        Uint8Array.from([101]),
        Uint8Array.from([102]),
        Uint8Array.from([103]),
        Uint8Array.from([104]),
        Uint8Array.from([105]),
        Uint8Array.from([106]),
        Uint8Array.from([107]),
        Uint8Array.from([108]),
        Uint8Array.from([109]),
        Uint8Array.from([110]),
        Uint8Array.from([111]),
        Uint8Array.from([112]),
        Uint8Array.from([113]),
        Uint8Array.from([114]),
        Uint8Array.from([115]),
        Uint8Array.from([116]),
        Uint8Array.from([117]),
        Uint8Array.from([118]),
        Uint8Array.from([119]),
        Uint8Array.from([120]),
        Uint8Array.from([121]),
        Uint8Array.from([122]),
        Uint8Array.from([123]),
        Uint8Array.from([124]),
        Uint8Array.from([125]),
        Uint8Array.from([126]),
        Uint8Array.from([127]),
        Uint8Array.from([128]),
        Uint8Array.from([129]),
        Uint8Array.from([130]),
        Uint8Array.from([131]),
        Uint8Array.from([132]),
        Uint8Array.from([133]),
        Uint8Array.from([134]),
        Uint8Array.from([135]),
        Uint8Array.from([136]),
        Uint8Array.from([137]),
        Uint8Array.from([138]),
        Uint8Array.from([139]),
        Uint8Array.from([140]),
        Uint8Array.from([141]),
        Uint8Array.from([142]),
        Uint8Array.from([143]),
        Uint8Array.from([144]),
        Uint8Array.from([145]),
        Uint8Array.from([146]),
        Uint8Array.from([147]),
        Uint8Array.from([148]),
        Uint8Array.from([149]),
        Uint8Array.from([150]),
        Uint8Array.from([151]),
        Uint8Array.from([152]),
        Uint8Array.from([153]),
        Uint8Array.from([154]),
        Uint8Array.from([155]),
        Uint8Array.from([156]),
        Uint8Array.from([157]),
        Uint8Array.from([158]),
        Uint8Array.from([159]),
        Uint8Array.from([160]),
        Uint8Array.from([161]),
        Uint8Array.from([162]),
        Uint8Array.from([163]),
        Uint8Array.from([164]),
        Uint8Array.from([165]),
        Uint8Array.from([166]),
        Uint8Array.from([167]),
        Uint8Array.from([168]),
        Uint8Array.from([169]),
        Uint8Array.from([170]),
        Uint8Array.from([171]),
        Uint8Array.from([172]),
        Uint8Array.from([173]),
        Uint8Array.from([174]),
        Uint8Array.from([175]),
        Uint8Array.from([176]),
        Uint8Array.from([177]),
        Uint8Array.from([178]),
        Uint8Array.from([179]),
        Uint8Array.from([180]),
        Uint8Array.from([181]),
        Uint8Array.from([182]),
        Uint8Array.from([183]),
        Uint8Array.from([184]),
        Uint8Array.from([185]),
        Uint8Array.from([186]),
        Uint8Array.from([187]),
        Uint8Array.from([188]),
        Uint8Array.from([189]),
        Uint8Array.from([190]),
        Uint8Array.from([191]),
        Uint8Array.from([192]),
        Uint8Array.from([193]),
        Uint8Array.from([194]),
        Uint8Array.from([195]),
        Uint8Array.from([196]),
        Uint8Array.from([197]),
        Uint8Array.from([198]),
        Uint8Array.from([199]),
        Uint8Array.from([200]),
        Uint8Array.from([201]),
        Uint8Array.from([202]),
        Uint8Array.from([203]),
        Uint8Array.from([204]),
        Uint8Array.from([205]),
        Uint8Array.from([206]),
        Uint8Array.from([207]),
        Uint8Array.from([208]),
        Uint8Array.from([209]),
        Uint8Array.from([210]),
        Uint8Array.from([211]),
        Uint8Array.from([212]),
        Uint8Array.from([213]),
        Uint8Array.from([214]),
        Uint8Array.from([215]),
        Uint8Array.from([216]),
        Uint8Array.from([217]),
        Uint8Array.from([218]),
        Uint8Array.from([219]),
        Uint8Array.from([220]),
        Uint8Array.from([221]),
        Uint8Array.from([222]),
        Uint8Array.from([223]),
        Uint8Array.from([224]),
        Uint8Array.from([225]),
        Uint8Array.from([226]),
        Uint8Array.from([227]),
        Uint8Array.from([228]),
        Uint8Array.from([229]),
        Uint8Array.from([230]),
        Uint8Array.from([231]),
        Uint8Array.from([232]),
        Uint8Array.from([233]),
        Uint8Array.from([234]),
        Uint8Array.from([235]),
        Uint8Array.from([236]),
        Uint8Array.from([237]),
        Uint8Array.from([238]),
        Uint8Array.from([239]),
        Uint8Array.from([240]),
        Uint8Array.from([241]),
        Uint8Array.from([242]),
        Uint8Array.from([243]),
        Uint8Array.from([244]),
        Uint8Array.from([245]),
        Uint8Array.from([246]),
        Uint8Array.from([247]),
        Uint8Array.from([248]),
        Uint8Array.from([249]),
        Uint8Array.from([250]),
        Uint8Array.from([251]),
        Uint8Array.from([252]),
        Uint8Array.from([253]),
        Uint8Array.from([254]),
        Uint8Array.from([255]),
      ],
      eRRBADHEADER: 5n,
      eRRINVALIDPARENT: 7n,
      eRROUTOFBOUNDS: 1n,
      eRRPROOFTOOSHORT: 6n,
      eRRTOOMANYTXINS: 2n,
      eRRTOOMANYTXOUTS: 3n,
      eRRVARSLICETOOLONG: 4n,
      lIST_128: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      lIST_16: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      lIST_256: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      lIST_32: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      lIST_512: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      lIST_64: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
    },
    "non_fungible_tokens": [],
    "fungible_tokens": [],
    "epoch": "Epoch21",
    "clarity_version": "Clarity2",
    contractName: "clarity-bitcoin",
  },
  ftTrait: {
    "functions": {},
    "maps": {},
    "variables": {},
    constants: {},
    "non_fungible_tokens": [],
    "fungible_tokens": [],
    "epoch": "Epoch20",
    "clarity_version": "Clarity1",
    contractName: "ft-trait",
  },
  magic: {
    "functions": {
      transfer: {
        "name": "transfer",
        "access": "private",
        "args": [{ "name": "amount", "type": "uint128" }, {
          "name": "sender",
          "type": "principal",
        }, { "name": "recipient", "type": "principal" }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          sender: TypedAbiArg<string, "sender">,
          recipient: TypedAbiArg<string, "recipient">,
        ],
        Response<boolean, bigint>
      >,
      updateUserInboundVolume: {
        "name": "update-user-inbound-volume",
        "access": "private",
        "args": [{ "name": "user", "type": "principal" }, {
          "name": "amount",
          "type": "uint128",
        }],
        "outputs": { "type": "bool" },
      } as TypedAbiFunction<
        [
          user: TypedAbiArg<string, "user">,
          amount: TypedAbiArg<number | bigint, "amount">,
        ],
        boolean
      >,
      updateUserOutboundVolume: {
        "name": "update-user-outbound-volume",
        "access": "private",
        "args": [{ "name": "user", "type": "principal" }, {
          "name": "amount",
          "type": "uint128",
        }],
        "outputs": { "type": "bool" },
      } as TypedAbiFunction<
        [
          user: TypedAbiArg<string, "user">,
          amount: TypedAbiArg<number | bigint, "amount">,
        ],
        boolean
      >,
      addFunds: {
        "name": "add-funds",
        "access": "public",
        "args": [{ "name": "amount", "type": "uint128" }],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [amount: TypedAbiArg<number | bigint, "amount">],
        Response<bigint, bigint>
      >,
      escrowSwap: {
        "name": "escrow-swap",
        "access": "public",
        "args": [
          {
            "name": "block",
            "type": {
              "tuple": [{
                "name": "header",
                "type": { "buffer": { "length": 80 } },
              }, { "name": "height", "type": "uint128" }],
            },
          },
          {
            "name": "prev-blocks",
            "type": {
              "list": { "type": { "buffer": { "length": 80 } }, "length": 10 },
            },
          },
          { "name": "tx", "type": { "buffer": { "length": 1024 } } },
          {
            "name": "proof",
            "type": {
              "tuple": [
                {
                  "name": "hashes",
                  "type": {
                    "list": {
                      "type": { "buffer": { "length": 32 } },
                      "length": 20,
                    },
                  },
                },
                { "name": "tree-depth", "type": "uint128" },
                { "name": "tx-index", "type": "uint128" },
              ],
            },
          },
          { "name": "output-index", "type": "uint128" },
          { "name": "sender", "type": { "buffer": { "length": 33 } } },
          { "name": "recipient", "type": { "buffer": { "length": 33 } } },
          { "name": "expiration-buff", "type": { "buffer": { "length": 4 } } },
          { "name": "hash", "type": { "buffer": { "length": 32 } } },
          { "name": "swapper", "type": "principal" },
          { "name": "supplier-id", "type": "uint128" },
          { "name": "max-base-fee", "type": "int128" },
          { "name": "max-fee-rate", "type": "int128" },
        ],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "csv", "type": "uint128" },
                  { "name": "output-index", "type": "uint128" },
                  {
                    "name": "redeem-script",
                    "type": { "buffer": { "length": 151 } },
                  },
                  { "name": "sats", "type": "uint128" },
                  {
                    "name": "sender-public-key",
                    "type": { "buffer": { "length": 33 } },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          block: TypedAbiArg<{
            "header": Uint8Array;
            "height": number | bigint;
          }, "block">,
          prevBlocks: TypedAbiArg<Uint8Array[], "prevBlocks">,
          tx: TypedAbiArg<Uint8Array, "tx">,
          proof: TypedAbiArg<{
            "hashes": Uint8Array[];
            "treeDepth": number | bigint;
            "txIndex": number | bigint;
          }, "proof">,
          outputIndex: TypedAbiArg<number | bigint, "outputIndex">,
          sender: TypedAbiArg<Uint8Array, "sender">,
          recipient: TypedAbiArg<Uint8Array, "recipient">,
          expirationBuff: TypedAbiArg<Uint8Array, "expirationBuff">,
          hash: TypedAbiArg<Uint8Array, "hash">,
          swapper: TypedAbiArg<string, "swapper">,
          supplierId: TypedAbiArg<number | bigint, "supplierId">,
          maxBaseFee: TypedAbiArg<number | bigint, "maxBaseFee">,
          maxFeeRate: TypedAbiArg<number | bigint, "maxFeeRate">,
        ],
        Response<{
          "csv": bigint;
          "outputIndex": bigint;
          "redeemScript": Uint8Array;
          "sats": bigint;
          "senderPublicKey": Uint8Array;
        }, bigint>
      >,
      finalizeOutboundSwap: {
        "name": "finalize-outbound-swap",
        "access": "public",
        "args": [
          {
            "name": "block",
            "type": {
              "tuple": [{
                "name": "header",
                "type": { "buffer": { "length": 80 } },
              }, { "name": "height", "type": "uint128" }],
            },
          },
          {
            "name": "prev-blocks",
            "type": {
              "list": { "type": { "buffer": { "length": 80 } }, "length": 10 },
            },
          },
          { "name": "tx", "type": { "buffer": { "length": 1024 } } },
          {
            "name": "proof",
            "type": {
              "tuple": [
                {
                  "name": "hashes",
                  "type": {
                    "list": {
                      "type": { "buffer": { "length": 32 } },
                      "length": 20,
                    },
                  },
                },
                { "name": "tree-depth", "type": "uint128" },
                { "name": "tx-index", "type": "uint128" },
              ],
            },
          },
          { "name": "output-index", "type": "uint128" },
          { "name": "swap-id", "type": "uint128" },
        ],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<[
        block: TypedAbiArg<{
          "header": Uint8Array;
          "height": number | bigint;
        }, "block">,
        prevBlocks: TypedAbiArg<Uint8Array[], "prevBlocks">,
        tx: TypedAbiArg<Uint8Array, "tx">,
        proof: TypedAbiArg<{
          "hashes": Uint8Array[];
          "treeDepth": number | bigint;
          "txIndex": number | bigint;
        }, "proof">,
        outputIndex: TypedAbiArg<number | bigint, "outputIndex">,
        swapId: TypedAbiArg<number | bigint, "swapId">,
      ], Response<boolean, bigint>>,
      finalizeSwap: {
        "name": "finalize-swap",
        "access": "public",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }, {
          "name": "preimage",
          "type": { "buffer": { "length": 128 } },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "expiration", "type": "uint128" },
                  { "name": "hash", "type": { "buffer": { "length": 32 } } },
                  { "name": "supplier", "type": "uint128" },
                  { "name": "swapper", "type": "principal" },
                  { "name": "xbtc", "type": "uint128" },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          txid: TypedAbiArg<Uint8Array, "txid">,
          preimage: TypedAbiArg<Uint8Array, "preimage">,
        ],
        Response<{
          "expiration": bigint;
          "hash": Uint8Array;
          "supplier": bigint;
          "swapper": string;
          "xbtc": bigint;
        }, bigint>
      >,
      initiateOutboundSwap: {
        "name": "initiate-outbound-swap",
        "access": "public",
        "args": [
          { "name": "xbtc", "type": "uint128" },
          { "name": "output", "type": { "buffer": { "length": 128 } } },
          { "name": "supplier-id", "type": "uint128" },
          { "name": "min-to-receive", "type": "uint128" },
        ],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          xbtc: TypedAbiArg<number | bigint, "xbtc">,
          output: TypedAbiArg<Uint8Array, "output">,
          supplierId: TypedAbiArg<number | bigint, "supplierId">,
          minToReceive: TypedAbiArg<number | bigint, "minToReceive">,
        ],
        Response<bigint, bigint>
      >,
      registerSupplier: {
        "name": "register-supplier",
        "access": "public",
        "args": [
          { "name": "public-key", "type": { "buffer": { "length": 33 } } },
          { "name": "inbound-fee", "type": { "optional": "int128" } },
          { "name": "outbound-fee", "type": { "optional": "int128" } },
          { "name": "outbound-base-fee", "type": "int128" },
          { "name": "inbound-base-fee", "type": "int128" },
          { "name": "funds", "type": "uint128" },
        ],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          publicKey: TypedAbiArg<Uint8Array, "publicKey">,
          inboundFee: TypedAbiArg<number | bigint | null, "inboundFee">,
          outboundFee: TypedAbiArg<number | bigint | null, "outboundFee">,
          outboundBaseFee: TypedAbiArg<number | bigint, "outboundBaseFee">,
          inboundBaseFee: TypedAbiArg<number | bigint, "inboundBaseFee">,
          funds: TypedAbiArg<number | bigint, "funds">,
        ],
        Response<bigint, bigint>
      >,
      removeFunds: {
        "name": "remove-funds",
        "access": "public",
        "args": [{ "name": "amount", "type": "uint128" }],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [amount: TypedAbiArg<number | bigint, "amount">],
        Response<bigint, bigint>
      >,
      revokeExpiredInbound: {
        "name": "revoke-expired-inbound",
        "access": "public",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "expiration", "type": "uint128" },
                  { "name": "hash", "type": { "buffer": { "length": 32 } } },
                  { "name": "supplier", "type": "uint128" },
                  { "name": "swapper", "type": "principal" },
                  { "name": "xbtc", "type": "uint128" },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        Response<{
          "expiration": bigint;
          "hash": Uint8Array;
          "supplier": bigint;
          "swapper": string;
          "xbtc": bigint;
        }, bigint>
      >,
      revokeExpiredOutbound: {
        "name": "revoke-expired-outbound",
        "access": "public",
        "args": [{ "name": "swap-id", "type": "uint128" }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "created-at", "type": "uint128" },
                  { "name": "output", "type": { "buffer": { "length": 128 } } },
                  { "name": "sats", "type": "uint128" },
                  { "name": "supplier", "type": "uint128" },
                  { "name": "swapper", "type": "principal" },
                  { "name": "xbtc", "type": "uint128" },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [swapId: TypedAbiArg<number | bigint, "swapId">],
        Response<{
          "createdAt": bigint;
          "output": Uint8Array;
          "sats": bigint;
          "supplier": bigint;
          "swapper": string;
          "xbtc": bigint;
        }, bigint>
      >,
      updateSupplierFees: {
        "name": "update-supplier-fees",
        "access": "public",
        "args": [
          { "name": "inbound-fee", "type": { "optional": "int128" } },
          { "name": "outbound-fee", "type": { "optional": "int128" } },
          { "name": "outbound-base-fee", "type": "int128" },
          { "name": "inbound-base-fee", "type": "int128" },
        ],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "controller", "type": "principal" },
                  { "name": "inbound-base-fee", "type": "int128" },
                  { "name": "inbound-fee", "type": { "optional": "int128" } },
                  { "name": "outbound-base-fee", "type": "int128" },
                  { "name": "outbound-fee", "type": { "optional": "int128" } },
                  {
                    "name": "public-key",
                    "type": { "buffer": { "length": 33 } },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          inboundFee: TypedAbiArg<number | bigint | null, "inboundFee">,
          outboundFee: TypedAbiArg<number | bigint | null, "outboundFee">,
          outboundBaseFee: TypedAbiArg<number | bigint, "outboundBaseFee">,
          inboundBaseFee: TypedAbiArg<number | bigint, "inboundBaseFee">,
        ],
        Response<{
          "controller": string;
          "inboundBaseFee": bigint;
          "inboundFee": bigint | null;
          "outboundBaseFee": bigint;
          "outboundFee": bigint | null;
          "publicKey": Uint8Array;
        }, bigint>
      >,
      updateSupplierPublicKey: {
        "name": "update-supplier-public-key",
        "access": "public",
        "args": [{
          "name": "public-key",
          "type": { "buffer": { "length": 33 } },
        }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "controller", "type": "principal" },
                  { "name": "inbound-base-fee", "type": "int128" },
                  { "name": "inbound-fee", "type": { "optional": "int128" } },
                  { "name": "outbound-base-fee", "type": "int128" },
                  { "name": "outbound-fee", "type": { "optional": "int128" } },
                  {
                    "name": "public-key",
                    "type": { "buffer": { "length": 33 } },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [publicKey: TypedAbiArg<Uint8Array, "publicKey">],
        Response<{
          "controller": string;
          "inboundBaseFee": bigint;
          "inboundFee": bigint | null;
          "outboundBaseFee": bigint;
          "outboundFee": bigint | null;
          "publicKey": Uint8Array;
        }, bigint>
      >,
      bytesLen: {
        "name": "bytes-len",
        "access": "read_only",
        "args": [{ "name": "bytes", "type": { "buffer": { "length": 4 } } }],
        "outputs": { "type": { "buffer": { "length": 1 } } },
      } as TypedAbiFunction<
        [bytes: TypedAbiArg<Uint8Array, "bytes">],
        Uint8Array
      >,
      generateHtlcScript: {
        "name": "generate-htlc-script",
        "access": "read_only",
        "args": [
          { "name": "sender", "type": { "buffer": { "length": 33 } } },
          { "name": "recipient", "type": { "buffer": { "length": 33 } } },
          { "name": "expiration", "type": { "buffer": { "length": 4 } } },
          { "name": "hash", "type": { "buffer": { "length": 32 } } },
          { "name": "metadata", "type": { "buffer": { "length": 32 } } },
        ],
        "outputs": { "type": { "buffer": { "length": 151 } } },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<Uint8Array, "sender">,
          recipient: TypedAbiArg<Uint8Array, "recipient">,
          expiration: TypedAbiArg<Uint8Array, "expiration">,
          hash: TypedAbiArg<Uint8Array, "hash">,
          metadata: TypedAbiArg<Uint8Array, "metadata">,
        ],
        Uint8Array
      >,
      generateWshOutput: {
        "name": "generate-wsh-output",
        "access": "read_only",
        "args": [{ "name": "script", "type": { "buffer": { "length": 151 } } }],
        "outputs": { "type": { "buffer": { "length": 34 } } },
      } as TypedAbiFunction<
        [script: TypedAbiArg<Uint8Array, "script">],
        Uint8Array
      >,
      getAmountWithFeeRate: {
        "name": "get-amount-with-fee-rate",
        "access": "read_only",
        "args": [{ "name": "amount", "type": "uint128" }, {
          "name": "fee-rate",
          "type": "int128",
        }],
        "outputs": { "type": "int128" },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          feeRate: TypedAbiArg<number | bigint, "feeRate">,
        ],
        bigint
      >,
      getCompletedOutboundSwapByTxid: {
        "name": "get-completed-outbound-swap-by-txid",
        "access": "read_only",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": { "type": { "optional": "uint128" } },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        bigint | null
      >,
      getCompletedOutboundSwapTxid: {
        "name": "get-completed-outbound-swap-txid",
        "access": "read_only",
        "args": [{ "name": "id", "type": "uint128" }],
        "outputs": { "type": { "optional": { "buffer": { "length": 32 } } } },
      } as TypedAbiFunction<
        [id: TypedAbiArg<number | bigint, "id">],
        Uint8Array | null
      >,
      getEscrow: {
        "name": "get-escrow",
        "access": "read_only",
        "args": [{ "name": "id", "type": "uint128" }],
        "outputs": { "type": { "optional": "uint128" } },
      } as TypedAbiFunction<
        [id: TypedAbiArg<number | bigint, "id">],
        bigint | null
      >,
      getFullInbound: {
        "name": "get-full-inbound",
        "access": "read_only",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "csv", "type": "uint128" },
                  { "name": "expiration", "type": "uint128" },
                  { "name": "hash", "type": { "buffer": { "length": 32 } } },
                  { "name": "output-index", "type": "uint128" },
                  {
                    "name": "redeem-script",
                    "type": { "buffer": { "length": 151 } },
                  },
                  { "name": "sats", "type": "uint128" },
                  {
                    "name": "sender-public-key",
                    "type": { "buffer": { "length": 33 } },
                  },
                  { "name": "supplier", "type": "uint128" },
                  { "name": "swapper", "type": "principal" },
                  { "name": "xbtc", "type": "uint128" },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        Response<{
          "csv": bigint;
          "expiration": bigint;
          "hash": Uint8Array;
          "outputIndex": bigint;
          "redeemScript": Uint8Array;
          "sats": bigint;
          "senderPublicKey": Uint8Array;
          "supplier": bigint;
          "swapper": string;
          "xbtc": bigint;
        }, bigint>
      >,
      getFullSupplier: {
        "name": "get-full-supplier",
        "access": "read_only",
        "args": [{ "name": "id", "type": "uint128" }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "controller", "type": "principal" },
                  { "name": "escrow", "type": "uint128" },
                  { "name": "funds", "type": "uint128" },
                  { "name": "inbound-base-fee", "type": "int128" },
                  { "name": "inbound-fee", "type": { "optional": "int128" } },
                  { "name": "outbound-base-fee", "type": "int128" },
                  { "name": "outbound-fee", "type": { "optional": "int128" } },
                  {
                    "name": "public-key",
                    "type": { "buffer": { "length": 33 } },
                  },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [id: TypedAbiArg<number | bigint, "id">],
        Response<{
          "controller": string;
          "escrow": bigint;
          "funds": bigint;
          "inboundBaseFee": bigint;
          "inboundFee": bigint | null;
          "outboundBaseFee": bigint;
          "outboundFee": bigint | null;
          "publicKey": Uint8Array;
        }, bigint>
      >,
      getFunds: {
        "name": "get-funds",
        "access": "read_only",
        "args": [{ "name": "id", "type": "uint128" }],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[id: TypedAbiArg<number | bigint, "id">], bigint>,
      getInboundMeta: {
        "name": "get-inbound-meta",
        "access": "read_only",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": {
          "type": {
            "optional": {
              "tuple": [
                { "name": "csv", "type": "uint128" },
                { "name": "output-index", "type": "uint128" },
                {
                  "name": "redeem-script",
                  "type": { "buffer": { "length": 151 } },
                },
                { "name": "sats", "type": "uint128" },
                {
                  "name": "sender-public-key",
                  "type": { "buffer": { "length": 33 } },
                },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        {
          "csv": bigint;
          "outputIndex": bigint;
          "redeemScript": Uint8Array;
          "sats": bigint;
          "senderPublicKey": Uint8Array;
        } | null
      >,
      getInboundSwap: {
        "name": "get-inbound-swap",
        "access": "read_only",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": {
          "type": {
            "optional": {
              "tuple": [
                { "name": "expiration", "type": "uint128" },
                { "name": "hash", "type": { "buffer": { "length": 32 } } },
                { "name": "supplier", "type": "uint128" },
                { "name": "swapper", "type": "principal" },
                { "name": "xbtc", "type": "uint128" },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        {
          "expiration": bigint;
          "hash": Uint8Array;
          "supplier": bigint;
          "swapper": string;
          "xbtc": bigint;
        } | null
      >,
      getNextOutboundId: {
        "name": "get-next-outbound-id",
        "access": "read_only",
        "args": [],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[], bigint>,
      getNextSupplierId: {
        "name": "get-next-supplier-id",
        "access": "read_only",
        "args": [],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[], bigint>,
      getOutboundSwap: {
        "name": "get-outbound-swap",
        "access": "read_only",
        "args": [{ "name": "id", "type": "uint128" }],
        "outputs": {
          "type": {
            "optional": {
              "tuple": [
                { "name": "created-at", "type": "uint128" },
                { "name": "output", "type": { "buffer": { "length": 128 } } },
                { "name": "sats", "type": "uint128" },
                { "name": "supplier", "type": "uint128" },
                { "name": "swapper", "type": "principal" },
                { "name": "xbtc", "type": "uint128" },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [id: TypedAbiArg<number | bigint, "id">],
        {
          "createdAt": bigint;
          "output": Uint8Array;
          "sats": bigint;
          "supplier": bigint;
          "swapper": string;
          "xbtc": bigint;
        } | null
      >,
      getPreimage: {
        "name": "get-preimage",
        "access": "read_only",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": { "type": { "optional": { "buffer": { "length": 128 } } } },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        Uint8Array | null
      >,
      getSupplier: {
        "name": "get-supplier",
        "access": "read_only",
        "args": [{ "name": "id", "type": "uint128" }],
        "outputs": {
          "type": {
            "optional": {
              "tuple": [
                { "name": "controller", "type": "principal" },
                { "name": "inbound-base-fee", "type": "int128" },
                { "name": "inbound-fee", "type": { "optional": "int128" } },
                { "name": "outbound-base-fee", "type": "int128" },
                { "name": "outbound-fee", "type": { "optional": "int128" } },
                {
                  "name": "public-key",
                  "type": { "buffer": { "length": 33 } },
                },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [id: TypedAbiArg<number | bigint, "id">],
        {
          "controller": string;
          "inboundBaseFee": bigint;
          "inboundFee": bigint | null;
          "outboundBaseFee": bigint;
          "outboundFee": bigint | null;
          "publicKey": Uint8Array;
        } | null
      >,
      getSupplierIdByController: {
        "name": "get-supplier-id-by-controller",
        "access": "read_only",
        "args": [{ "name": "controller", "type": "principal" }],
        "outputs": { "type": { "optional": "uint128" } },
      } as TypedAbiFunction<
        [controller: TypedAbiArg<string, "controller">],
        bigint | null
      >,
      getSupplierIdByPublicKey: {
        "name": "get-supplier-id-by-public-key",
        "access": "read_only",
        "args": [{
          "name": "public-key",
          "type": { "buffer": { "length": 33 } },
        }],
        "outputs": { "type": { "optional": "uint128" } },
      } as TypedAbiFunction<
        [publicKey: TypedAbiArg<Uint8Array, "publicKey">],
        bigint | null
      >,
      getSwapAmount: {
        "name": "get-swap-amount",
        "access": "read_only",
        "args": [{ "name": "amount", "type": "uint128" }, {
          "name": "fee-rate",
          "type": "int128",
        }, { "name": "base-fee", "type": "int128" }],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          feeRate: TypedAbiArg<number | bigint, "feeRate">,
          baseFee: TypedAbiArg<number | bigint, "baseFee">,
        ],
        Response<bigint, bigint>
      >,
      getTotalInboundVolume: {
        "name": "get-total-inbound-volume",
        "access": "read_only",
        "args": [],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[], bigint>,
      getTotalOutboundVolume: {
        "name": "get-total-outbound-volume",
        "access": "read_only",
        "args": [],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[], bigint>,
      getTotalVolume: {
        "name": "get-total-volume",
        "access": "read_only",
        "args": [],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[], bigint>,
      getUserInboundVolume: {
        "name": "get-user-inbound-volume",
        "access": "read_only",
        "args": [{ "name": "user", "type": "principal" }],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[user: TypedAbiArg<string, "user">], bigint>,
      getUserOutboundVolume: {
        "name": "get-user-outbound-volume",
        "access": "read_only",
        "args": [{ "name": "user", "type": "principal" }],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[user: TypedAbiArg<string, "user">], bigint>,
      getUserTotalVolume: {
        "name": "get-user-total-volume",
        "access": "read_only",
        "args": [{ "name": "user", "type": "principal" }],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[user: TypedAbiArg<string, "user">], bigint>,
      hashMetadata: {
        "name": "hash-metadata",
        "access": "read_only",
        "args": [{ "name": "swapper", "type": "principal" }, {
          "name": "base-fee",
          "type": "int128",
        }, { "name": "fee-rate", "type": "int128" }],
        "outputs": { "type": { "buffer": { "length": 32 } } },
      } as TypedAbiFunction<
        [
          swapper: TypedAbiArg<string, "swapper">,
          baseFee: TypedAbiArg<number | bigint, "baseFee">,
          feeRate: TypedAbiArg<number | bigint, "feeRate">,
        ],
        Uint8Array
      >,
      readVarint: {
        "name": "read-varint",
        "access": "read_only",
        "args": [{ "name": "num", "type": { "buffer": { "length": 4 } } }],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [num: TypedAbiArg<Uint8Array, "num">],
        Response<bigint, bigint>
      >,
      serializeMetadata: {
        "name": "serialize-metadata",
        "access": "read_only",
        "args": [{ "name": "swapper", "type": "principal" }, {
          "name": "base-fee",
          "type": "int128",
        }, { "name": "fee-rate", "type": "int128" }],
        "outputs": { "type": { "buffer": { "length": 216 } } },
      } as TypedAbiFunction<
        [
          swapper: TypedAbiArg<string, "swapper">,
          baseFee: TypedAbiArg<number | bigint, "baseFee">,
          feeRate: TypedAbiArg<number | bigint, "feeRate">,
        ],
        Uint8Array
      >,
      validateExpiration: {
        "name": "validate-expiration",
        "access": "read_only",
        "args": [{ "name": "expiration", "type": "uint128" }, {
          "name": "mined-height",
          "type": "uint128",
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          expiration: TypedAbiArg<number | bigint, "expiration">,
          minedHeight: TypedAbiArg<number | bigint, "minedHeight">,
        ],
        Response<boolean, bigint>
      >,
      validateFee: {
        "name": "validate-fee",
        "access": "read_only",
        "args": [{ "name": "fee-opt", "type": { "optional": "int128" } }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [feeOpt: TypedAbiArg<number | bigint | null, "feeOpt">],
        Response<boolean, bigint>
      >,
      validateOutboundRevocable: {
        "name": "validate-outbound-revocable",
        "access": "read_only",
        "args": [{ "name": "swap-id", "type": "uint128" }],
        "outputs": {
          "type": {
            "response": {
              "ok": {
                "tuple": [
                  { "name": "created-at", "type": "uint128" },
                  { "name": "output", "type": { "buffer": { "length": 128 } } },
                  { "name": "sats", "type": "uint128" },
                  { "name": "supplier", "type": "uint128" },
                  { "name": "swapper", "type": "principal" },
                  { "name": "xbtc", "type": "uint128" },
                ],
              },
              "error": "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [swapId: TypedAbiArg<number | bigint, "swapId">],
        Response<{
          "createdAt": bigint;
          "output": Uint8Array;
          "sats": bigint;
          "supplier": bigint;
          "swapper": string;
          "xbtc": bigint;
        }, bigint>
      >,
    },
    "maps": {
      completedOutboundSwapTxids: {
        "name": "completed-outbound-swap-txids",
        "key": { "buffer": { "length": 32 } },
        "value": "uint128",
      } as TypedAbiMap<Uint8Array, bigint>,
      completedOutboundSwaps: {
        "name": "completed-outbound-swaps",
        "key": "uint128",
        "value": { "buffer": { "length": 32 } },
      } as TypedAbiMap<number | bigint, Uint8Array>,
      inboundMeta: {
        "name": "inbound-meta",
        "key": { "buffer": { "length": 32 } },
        "value": {
          "tuple": [
            { "name": "csv", "type": "uint128" },
            { "name": "output-index", "type": "uint128" },
            {
              "name": "redeem-script",
              "type": { "buffer": { "length": 151 } },
            },
            { "name": "sats", "type": "uint128" },
            {
              "name": "sender-public-key",
              "type": { "buffer": { "length": 33 } },
            },
          ],
        },
      } as TypedAbiMap<Uint8Array, {
        "csv": bigint;
        "outputIndex": bigint;
        "redeemScript": Uint8Array;
        "sats": bigint;
        "senderPublicKey": Uint8Array;
      }>,
      inboundPreimages: {
        "name": "inbound-preimages",
        "key": { "buffer": { "length": 32 } },
        "value": { "buffer": { "length": 128 } },
      } as TypedAbiMap<Uint8Array, Uint8Array>,
      inboundSwaps: {
        "name": "inbound-swaps",
        "key": { "buffer": { "length": 32 } },
        "value": {
          "tuple": [
            { "name": "expiration", "type": "uint128" },
            { "name": "hash", "type": { "buffer": { "length": 32 } } },
            { "name": "supplier", "type": "uint128" },
            { "name": "swapper", "type": "principal" },
            { "name": "xbtc", "type": "uint128" },
          ],
        },
      } as TypedAbiMap<Uint8Array, {
        "expiration": bigint;
        "hash": Uint8Array;
        "supplier": bigint;
        "swapper": string;
        "xbtc": bigint;
      }>,
      outboundSwaps: {
        "name": "outbound-swaps",
        "key": "uint128",
        "value": {
          "tuple": [
            { "name": "created-at", "type": "uint128" },
            { "name": "output", "type": { "buffer": { "length": 128 } } },
            { "name": "sats", "type": "uint128" },
            { "name": "supplier", "type": "uint128" },
            { "name": "swapper", "type": "principal" },
            { "name": "xbtc", "type": "uint128" },
          ],
        },
      } as TypedAbiMap<number | bigint, {
        "createdAt": bigint;
        "output": Uint8Array;
        "sats": bigint;
        "supplier": bigint;
        "swapper": string;
        "xbtc": bigint;
      }>,
      supplierByController: {
        "name": "supplier-by-controller",
        "key": "principal",
        "value": "uint128",
      } as TypedAbiMap<string, bigint>,
      supplierById: {
        "name": "supplier-by-id",
        "key": "uint128",
        "value": {
          "tuple": [
            { "name": "controller", "type": "principal" },
            { "name": "inbound-base-fee", "type": "int128" },
            { "name": "inbound-fee", "type": { "optional": "int128" } },
            { "name": "outbound-base-fee", "type": "int128" },
            { "name": "outbound-fee", "type": { "optional": "int128" } },
            { "name": "public-key", "type": { "buffer": { "length": 33 } } },
          ],
        },
      } as TypedAbiMap<number | bigint, {
        "controller": string;
        "inboundBaseFee": bigint;
        "inboundFee": bigint | null;
        "outboundBaseFee": bigint;
        "outboundFee": bigint | null;
        "publicKey": Uint8Array;
      }>,
      supplierByPublicKey: {
        "name": "supplier-by-public-key",
        "key": { "buffer": { "length": 33 } },
        "value": "uint128",
      } as TypedAbiMap<Uint8Array, bigint>,
      supplierEscrow: {
        "name": "supplier-escrow",
        "key": "uint128",
        "value": "uint128",
      } as TypedAbiMap<number | bigint, bigint>,
      supplierFunds: {
        "name": "supplier-funds",
        "key": "uint128",
        "value": "uint128",
      } as TypedAbiMap<number | bigint, bigint>,
      swapperById: {
        "name": "swapper-by-id",
        "key": "uint128",
        "value": "principal",
      } as TypedAbiMap<number | bigint, string>,
      swapperByPrincipal: {
        "name": "swapper-by-principal",
        "key": "principal",
        "value": "uint128",
      } as TypedAbiMap<string, bigint>,
      userInboundVolumeMap: {
        "name": "user-inbound-volume-map",
        "key": "principal",
        "value": "uint128",
      } as TypedAbiMap<string, bigint>,
      userOutboundVolumeMap: {
        "name": "user-outbound-volume-map",
        "key": "principal",
        "value": "uint128",
      } as TypedAbiMap<string, bigint>,
    },
    "variables": {
      BUFF_TO_BYTE: {
        name: "BUFF_TO_BYTE",
        type: {
          list: {
            type: {
              buffer: {
                length: 1,
              },
            },
            length: 5,
          },
        },
        access: "constant",
      } as TypedAbiVariable<Uint8Array[]>,
      ERR_ADD_FUNDS: {
        name: "ERR_ADD_FUNDS",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_ALREADY_FINALIZED: {
        name: "ERR_ALREADY_FINALIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_ESCROW_EXPIRED: {
        name: "ERR_ESCROW_EXPIRED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_FEE_INVALID: {
        name: "ERR_FEE_INVALID",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INCONSISTENT_FEES: {
        name: "ERR_INCONSISTENT_FEES",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INSUFFICIENT_AMOUNT: {
        name: "ERR_INSUFFICIENT_AMOUNT",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INSUFFICIENT_FUNDS: {
        name: "ERR_INSUFFICIENT_FUNDS",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_BTC_ADDR: {
        name: "ERR_INVALID_BTC_ADDR",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_ESCROW: {
        name: "ERR_INVALID_ESCROW",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_EXPIRATION: {
        name: "ERR_INVALID_EXPIRATION",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_HASH: {
        name: "ERR_INVALID_HASH",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_OUTPUT: {
        name: "ERR_INVALID_OUTPUT",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_PREIMAGE: {
        name: "ERR_INVALID_PREIMAGE",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_SUPPLIER: {
        name: "ERR_INVALID_SUPPLIER",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_TX: {
        name: "ERR_INVALID_TX",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_READ_UINT: {
        name: "ERR_READ_UINT",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_REVOKE_INBOUND_IS_FINALIZED: {
        name: "ERR_REVOKE_INBOUND_IS_FINALIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_REVOKE_INBOUND_NOT_EXPIRED: {
        name: "ERR_REVOKE_INBOUND_NOT_EXPIRED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_REVOKE_OUTBOUND_IS_FINALIZED: {
        name: "ERR_REVOKE_OUTBOUND_IS_FINALIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_REVOKE_OUTBOUND_NOT_EXPIRED: {
        name: "ERR_REVOKE_OUTBOUND_NOT_EXPIRED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SUPPLIER_EXISTS: {
        name: "ERR_SUPPLIER_EXISTS",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SUPPLIER_NOT_FOUND: {
        name: "ERR_SUPPLIER_NOT_FOUND",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SWAPPER_EXISTS: {
        name: "ERR_SWAPPER_EXISTS",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SWAPPER_NOT_FOUND: {
        name: "ERR_SWAPPER_NOT_FOUND",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SWAP_NOT_FOUND: {
        name: "ERR_SWAP_NOT_FOUND",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_TRANSFER: {
        name: "ERR_TRANSFER",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_TXID_USED: {
        name: "ERR_TXID_USED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_TX_NOT_MINED: {
        name: "ERR_TX_NOT_MINED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED: {
        name: "ERR_UNAUTHORIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ESCROW_EXPIRATION: {
        name: "ESCROW_EXPIRATION",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      MAX_HTLC_EXPIRATION: {
        name: "MAX_HTLC_EXPIRATION",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      MIN_EXPIRATION: {
        name: "MIN_EXPIRATION",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      OUTBOUND_EXPIRATION: {
        name: "OUTBOUND_EXPIRATION",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      p2PKH_VERSION: {
        name: "P2PKH_VERSION",
        type: {
          buffer: {
            length: 1,
          },
        },
        access: "constant",
      } as TypedAbiVariable<Uint8Array>,
      p2SH_VERSION: {
        name: "P2SH_VERSION",
        type: {
          buffer: {
            length: 1,
          },
        },
        access: "constant",
      } as TypedAbiVariable<Uint8Array>,
      REVOKED_INBOUND_PREIMAGE: {
        name: "REVOKED_INBOUND_PREIMAGE",
        type: {
          buffer: {
            length: 1,
          },
        },
        access: "constant",
      } as TypedAbiVariable<Uint8Array>,
      REVOKED_OUTBOUND_TXID: {
        name: "REVOKED_OUTBOUND_TXID",
        type: {
          buffer: {
            length: 1,
          },
        },
        access: "constant",
      } as TypedAbiVariable<Uint8Array>,
      nextOutboundId: {
        name: "next-outbound-id",
        type: "uint128",
        access: "variable",
      } as TypedAbiVariable<bigint>,
      nextSupplierId: {
        name: "next-supplier-id",
        type: "uint128",
        access: "variable",
      } as TypedAbiVariable<bigint>,
      nextSwapperId: {
        name: "next-swapper-id",
        type: "uint128",
        access: "variable",
      } as TypedAbiVariable<bigint>,
      totalInboundVolumeVar: {
        name: "total-inbound-volume-var",
        type: "uint128",
        access: "variable",
      } as TypedAbiVariable<bigint>,
      totalOutboundVolumeVar: {
        name: "total-outbound-volume-var",
        type: "uint128",
        access: "variable",
      } as TypedAbiVariable<bigint>,
    },
    constants: {
      BUFF_TO_BYTE: [
        Uint8Array.from([0]),
        Uint8Array.from([1]),
        Uint8Array.from([2]),
        Uint8Array.from([3]),
        Uint8Array.from([4]),
      ],
      ERR_ADD_FUNDS: {
        isOk: false,
        value: 4n,
      },
      ERR_ALREADY_FINALIZED: {
        isOk: false,
        value: 17n,
      },
      ERR_ESCROW_EXPIRED: {
        isOk: false,
        value: 20n,
      },
      ERR_FEE_INVALID: {
        isOk: false,
        value: 8n,
      },
      ERR_INCONSISTENT_FEES: {
        isOk: false,
        value: 27n,
      },
      ERR_INSUFFICIENT_AMOUNT: {
        isOk: false,
        value: 24n,
      },
      ERR_INSUFFICIENT_FUNDS: {
        isOk: false,
        value: 14n,
      },
      ERR_INVALID_BTC_ADDR: {
        isOk: false,
        value: 22n,
      },
      ERR_INVALID_ESCROW: {
        isOk: false,
        value: 18n,
      },
      ERR_INVALID_EXPIRATION: {
        isOk: false,
        value: 15n,
      },
      ERR_INVALID_HASH: {
        isOk: false,
        value: 12n,
      },
      ERR_INVALID_OUTPUT: {
        isOk: false,
        value: 11n,
      },
      ERR_INVALID_PREIMAGE: {
        isOk: false,
        value: 19n,
      },
      ERR_INVALID_SUPPLIER: {
        isOk: false,
        value: 13n,
      },
      ERR_INVALID_TX: {
        isOk: false,
        value: 10n,
      },
      ERR_READ_UINT: {
        isOk: false,
        value: 100n,
      },
      ERR_REVOKE_INBOUND_IS_FINALIZED: {
        isOk: false,
        value: 29n,
      },
      ERR_REVOKE_INBOUND_NOT_EXPIRED: {
        isOk: false,
        value: 28n,
      },
      ERR_REVOKE_OUTBOUND_IS_FINALIZED: {
        isOk: false,
        value: 26n,
      },
      ERR_REVOKE_OUTBOUND_NOT_EXPIRED: {
        isOk: false,
        value: 25n,
      },
      ERR_SUPPLIER_EXISTS: {
        isOk: false,
        value: 2n,
      },
      ERR_SUPPLIER_NOT_FOUND: {
        isOk: false,
        value: 6n,
      },
      ERR_SWAPPER_EXISTS: {
        isOk: false,
        value: 9n,
      },
      ERR_SWAPPER_NOT_FOUND: {
        isOk: false,
        value: 7n,
      },
      ERR_SWAP_NOT_FOUND: {
        isOk: false,
        value: 23n,
      },
      ERR_TRANSFER: {
        isOk: false,
        value: 5n,
      },
      ERR_TXID_USED: {
        isOk: false,
        value: 16n,
      },
      ERR_TX_NOT_MINED: {
        isOk: false,
        value: 21n,
      },
      ERR_UNAUTHORIZED: {
        isOk: false,
        value: 3n,
      },
      ESCROW_EXPIRATION: 200n,
      MAX_HTLC_EXPIRATION: 550n,
      MIN_EXPIRATION: 250n,
      OUTBOUND_EXPIRATION: 200n,
      p2PKH_VERSION: Uint8Array.from([0]),
      p2SH_VERSION: Uint8Array.from([5]),
      REVOKED_INBOUND_PREIMAGE: Uint8Array.from([0]),
      REVOKED_OUTBOUND_TXID: Uint8Array.from([0]),
      nextOutboundId: 0n,
      nextSupplierId: 0n,
      nextSwapperId: 0n,
      totalInboundVolumeVar: 0n,
      totalOutboundVolumeVar: 0n,
    },
    "non_fungible_tokens": [],
    "fungible_tokens": [],
    "epoch": "Epoch21",
    "clarity_version": "Clarity2",
    contractName: "magic",
  },
  restrictedTokenTrait: {
    "functions": {},
    "maps": {},
    "variables": {},
    constants: {},
    "non_fungible_tokens": [],
    "fungible_tokens": [],
    "epoch": "Epoch20",
    "clarity_version": "Clarity1",
    contractName: "restricted-token-trait",
  },
  testUtils: {
    "functions": {
      setBurnHeader: {
        "name": "set-burn-header",
        "access": "public",
        "args": [{ "name": "height", "type": "uint128" }, {
          "name": "header",
          "type": { "buffer": { "length": 80 } },
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "none" } },
        },
      } as TypedAbiFunction<
        [
          height: TypedAbiArg<number | bigint, "height">,
          header: TypedAbiArg<Uint8Array, "header">,
        ],
        Response<boolean, null>
      >,
      setMined: {
        "name": "set-mined",
        "access": "public",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "none" } },
        },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        Response<boolean, null>
      >,
      setNotMined: {
        "name": "set-not-mined",
        "access": "public",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "none" } },
        },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        Response<boolean, null>
      >,
      burnBlockHeader: {
        "name": "burn-block-header",
        "access": "read_only",
        "args": [{ "name": "height", "type": "uint128" }],
        "outputs": { "type": { "optional": { "buffer": { "length": 80 } } } },
      } as TypedAbiFunction<
        [height: TypedAbiArg<number | bigint, "height">],
        Uint8Array | null
      >,
      wasMined: {
        "name": "was-mined",
        "access": "read_only",
        "args": [{ "name": "txid", "type": { "buffer": { "length": 32 } } }],
        "outputs": { "type": { "optional": "bool" } },
      } as TypedAbiFunction<
        [txid: TypedAbiArg<Uint8Array, "txid">],
        boolean | null
      >,
    },
    "maps": {
      burnBlockHeaders: {
        "name": "burn-block-headers",
        "key": "uint128",
        "value": { "buffer": { "length": 80 } },
      } as TypedAbiMap<number | bigint, Uint8Array>,
      minedTxs: {
        "name": "mined-txs",
        "key": { "buffer": { "length": 32 } },
        "value": "bool",
      } as TypedAbiMap<Uint8Array, boolean>,
    },
    "variables": {},
    constants: {},
    "non_fungible_tokens": [],
    "fungible_tokens": [],
    "epoch": "Epoch21",
    "clarity_version": "Clarity2",
    contractName: "test-utils",
  },
  wrappedBitcoin: {
    "functions": {
      addPrincipalToRole: {
        "name": "add-principal-to-role",
        "access": "public",
        "args": [{ "name": "role-to-add", "type": "uint128" }, {
          "name": "principal-to-add",
          "type": "principal",
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          roleToAdd: TypedAbiArg<number | bigint, "roleToAdd">,
          principalToAdd: TypedAbiArg<string, "principalToAdd">,
        ],
        Response<boolean, bigint>
      >,
      burnTokens: {
        "name": "burn-tokens",
        "access": "public",
        "args": [{ "name": "burn-amount", "type": "uint128" }, {
          "name": "burn-from",
          "type": "principal",
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          burnAmount: TypedAbiArg<number | bigint, "burnAmount">,
          burnFrom: TypedAbiArg<string, "burnFrom">,
        ],
        Response<boolean, bigint>
      >,
      initialize: {
        "name": "initialize",
        "access": "public",
        "args": [
          {
            "name": "name-to-set",
            "type": { "string-ascii": { "length": 32 } },
          },
          {
            "name": "symbol-to-set",
            "type": { "string-ascii": { "length": 32 } },
          },
          { "name": "decimals-to-set", "type": "uint128" },
          { "name": "initial-owner", "type": "principal" },
        ],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          nameToSet: TypedAbiArg<string, "nameToSet">,
          symbolToSet: TypedAbiArg<string, "symbolToSet">,
          decimalsToSet: TypedAbiArg<number | bigint, "decimalsToSet">,
          initialOwner: TypedAbiArg<string, "initialOwner">,
        ],
        Response<boolean, bigint>
      >,
      mintTokens: {
        "name": "mint-tokens",
        "access": "public",
        "args": [{ "name": "mint-amount", "type": "uint128" }, {
          "name": "mint-to",
          "type": "principal",
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          mintAmount: TypedAbiArg<number | bigint, "mintAmount">,
          mintTo: TypedAbiArg<string, "mintTo">,
        ],
        Response<boolean, bigint>
      >,
      removePrincipalFromRole: {
        "name": "remove-principal-from-role",
        "access": "public",
        "args": [{ "name": "role-to-remove", "type": "uint128" }, {
          "name": "principal-to-remove",
          "type": "principal",
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          roleToRemove: TypedAbiArg<number | bigint, "roleToRemove">,
          principalToRemove: TypedAbiArg<string, "principalToRemove">,
        ],
        Response<boolean, bigint>
      >,
      revokeTokens: {
        "name": "revoke-tokens",
        "access": "public",
        "args": [{ "name": "revoke-amount", "type": "uint128" }, {
          "name": "revoke-from",
          "type": "principal",
        }, { "name": "revoke-to", "type": "principal" }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          revokeAmount: TypedAbiArg<number | bigint, "revokeAmount">,
          revokeFrom: TypedAbiArg<string, "revokeFrom">,
          revokeTo: TypedAbiArg<string, "revokeTo">,
        ],
        Response<boolean, bigint>
      >,
      setTokenUri: {
        "name": "set-token-uri",
        "access": "public",
        "args": [{
          "name": "updated-uri",
          "type": { "string-utf8": { "length": 256 } },
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [updatedUri: TypedAbiArg<string, "updatedUri">],
        Response<boolean, bigint>
      >,
      transfer: {
        "name": "transfer",
        "access": "public",
        "args": [
          { "name": "amount", "type": "uint128" },
          { "name": "sender", "type": "principal" },
          { "name": "recipient", "type": "principal" },
          {
            "name": "memo",
            "type": { "optional": { "buffer": { "length": 34 } } },
          },
        ],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          sender: TypedAbiArg<string, "sender">,
          recipient: TypedAbiArg<string, "recipient">,
          memo: TypedAbiArg<Uint8Array | null, "memo">,
        ],
        Response<boolean, bigint>
      >,
      updateBlacklisted: {
        "name": "update-blacklisted",
        "access": "public",
        "args": [{ "name": "principal-to-update", "type": "principal" }, {
          "name": "set-blacklisted",
          "type": "bool",
        }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          principalToUpdate: TypedAbiArg<string, "principalToUpdate">,
          setBlacklisted: TypedAbiArg<boolean, "setBlacklisted">,
        ],
        Response<boolean, bigint>
      >,
      detectTransferRestriction: {
        "name": "detect-transfer-restriction",
        "access": "read_only",
        "args": [{ "name": "amount", "type": "uint128" }, {
          "name": "sender",
          "type": "principal",
        }, { "name": "recipient", "type": "principal" }],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "uint128" } },
        },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          sender: TypedAbiArg<string, "sender">,
          recipient: TypedAbiArg<string, "recipient">,
        ],
        Response<bigint, bigint>
      >,
      getBalance: {
        "name": "get-balance",
        "access": "read_only",
        "args": [{ "name": "owner", "type": "principal" }],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "none" } },
        },
      } as TypedAbiFunction<
        [owner: TypedAbiArg<string, "owner">],
        Response<bigint, null>
      >,
      getDecimals: {
        "name": "get-decimals",
        "access": "read_only",
        "args": [],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "none" } },
        },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      getName: {
        "name": "get-name",
        "access": "read_only",
        "args": [],
        "outputs": {
          "type": {
            "response": {
              "ok": { "string-ascii": { "length": 32 } },
              "error": "none",
            },
          },
        },
      } as TypedAbiFunction<[], Response<string, null>>,
      getSymbol: {
        "name": "get-symbol",
        "access": "read_only",
        "args": [],
        "outputs": {
          "type": {
            "response": {
              "ok": { "string-ascii": { "length": 32 } },
              "error": "none",
            },
          },
        },
      } as TypedAbiFunction<[], Response<string, null>>,
      getTokenUri: {
        "name": "get-token-uri",
        "access": "read_only",
        "args": [],
        "outputs": {
          "type": {
            "response": {
              "ok": { "optional": { "string-utf8": { "length": 256 } } },
              "error": "none",
            },
          },
        },
      } as TypedAbiFunction<[], Response<string | null, null>>,
      getTotalSupply: {
        "name": "get-total-supply",
        "access": "read_only",
        "args": [],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "none" } },
        },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      hasRole: {
        "name": "has-role",
        "access": "read_only",
        "args": [{ "name": "role-to-check", "type": "uint128" }, {
          "name": "principal-to-check",
          "type": "principal",
        }],
        "outputs": { "type": "bool" },
      } as TypedAbiFunction<
        [
          roleToCheck: TypedAbiArg<number | bigint, "roleToCheck">,
          principalToCheck: TypedAbiArg<string, "principalToCheck">,
        ],
        boolean
      >,
      isBlacklisted: {
        "name": "is-blacklisted",
        "access": "read_only",
        "args": [{ "name": "principal-to-check", "type": "principal" }],
        "outputs": { "type": "bool" },
      } as TypedAbiFunction<
        [principalToCheck: TypedAbiArg<string, "principalToCheck">],
        boolean
      >,
      messageForRestriction: {
        "name": "message-for-restriction",
        "access": "read_only",
        "args": [{ "name": "restriction-code", "type": "uint128" }],
        "outputs": {
          "type": {
            "response": {
              "ok": { "string-ascii": { "length": 70 } },
              "error": "none",
            },
          },
        },
      } as TypedAbiFunction<
        [restrictionCode: TypedAbiArg<number | bigint, "restrictionCode">],
        Response<string, null>
      >,
    },
    "maps": {
      blacklist: {
        "name": "blacklist",
        "key": { "tuple": [{ "name": "account", "type": "principal" }] },
        "value": { "tuple": [{ "name": "blacklisted", "type": "bool" }] },
      } as TypedAbiMap<{
        "account": string;
      }, {
        "blacklisted": boolean;
      }>,
      roles: {
        "name": "roles",
        "key": {
          "tuple": [{ "name": "account", "type": "principal" }, {
            "name": "role",
            "type": "uint128",
          }],
        },
        "value": { "tuple": [{ "name": "allowed", "type": "bool" }] },
      } as TypedAbiMap<{
        "account": string;
        "role": number | bigint;
      }, {
        "allowed": boolean;
      }>,
    },
    "variables": {
      BLACKLISTER_ROLE: {
        name: "BLACKLISTER_ROLE",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      BURNER_ROLE: {
        name: "BURNER_ROLE",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      MINTER_ROLE: {
        name: "MINTER_ROLE",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      OWNER_ROLE: {
        name: "OWNER_ROLE",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      PERMISSION_DENIED_ERROR: {
        name: "PERMISSION_DENIED_ERROR",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      RESTRICTION_BLACKLIST: {
        name: "RESTRICTION_BLACKLIST",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      RESTRICTION_NONE: {
        name: "RESTRICTION_NONE",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      REVOKER_ROLE: {
        name: "REVOKER_ROLE",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      deployerPrincipal: {
        name: "deployer-principal",
        type: "principal",
        access: "variable",
      } as TypedAbiVariable<string>,
      isInitialized: {
        name: "is-initialized",
        type: "bool",
        access: "variable",
      } as TypedAbiVariable<boolean>,
      tokenDecimals: {
        name: "token-decimals",
        type: "uint128",
        access: "variable",
      } as TypedAbiVariable<bigint>,
      tokenName: {
        name: "token-name",
        type: {
          "string-ascii": {
            length: 32,
          },
        },
        access: "variable",
      } as TypedAbiVariable<string>,
      tokenSymbol: {
        name: "token-symbol",
        type: {
          "string-ascii": {
            length: 32,
          },
        },
        access: "variable",
      } as TypedAbiVariable<string>,
      uri: {
        name: "uri",
        type: {
          "string-utf8": {
            length: 256,
          },
        },
        access: "variable",
      } as TypedAbiVariable<string>,
    },
    constants: {
      BLACKLISTER_ROLE: 4n,
      BURNER_ROLE: 2n,
      MINTER_ROLE: 1n,
      OWNER_ROLE: 0n,
      PERMISSION_DENIED_ERROR: 403n,
      RESTRICTION_BLACKLIST: 5n,
      RESTRICTION_NONE: 0n,
      REVOKER_ROLE: 3n,
      deployerPrincipal: "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR",
      isInitialized: false,
      tokenDecimals: 0n,
      tokenName: "",
      tokenSymbol: "",
      uri: "",
    },
    "non_fungible_tokens": [],
    "fungible_tokens": [{ "name": "wrapped-bitcoin" }],
    "epoch": "Epoch20",
    "clarity_version": "Clarity1",
    contractName: "Wrapped-Bitcoin",
  },
} as const;

export const accounts = {
  "deployer": {
    "address": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "balance": 100000000000000,
  },
  "faucet": {
    "address": "STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6",
    "balance": 100000000000000,
  },
  "wallet_1": {
    "address": "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
    "balance": 100000000000000,
  },
  "wallet_2": {
    "address": "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
    "balance": 100000000000000,
  },
  "wallet_3": {
    "address": "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC",
    "balance": 100000000000000,
  },
  "wallet_4": {
    "address": "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
    "balance": 100000000000000,
  },
  "wallet_5": {
    "address": "ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB",
    "balance": 100000000000000,
  },
  "wallet_6": {
    "address": "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0",
    "balance": 100000000000000,
  },
  "wallet_7": {
    "address": "ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ",
    "balance": 100000000000000,
  },
  "wallet_8": {
    "address": "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP",
    "balance": 100000000000000,
  },
} as const;

export const identifiers = {
  "clarityBitcoin": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.clarity-bitcoin",
  "ftTrait": "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait",
  "magic": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.magic",
  "restrictedTokenTrait":
    "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait",
  "testUtils": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.test-utils",
  "wrappedBitcoin": "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin",
} as const;

export const simnet = {
  accounts,
  contracts,
  identifiers,
} as const;
