/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { ERC20TokenMock } from "../ERC20TokenMock";

export class ERC20TokenMock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC20TokenMock> {
    return super.deploy(overrides || {}) as Promise<ERC20TokenMock>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ERC20TokenMock {
    return super.attach(address) as ERC20TokenMock;
  }
  connect(signer: Signer): ERC20TokenMock__factory {
    return super.connect(signer) as ERC20TokenMock__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20TokenMock {
    return new Contract(address, _abi, signerOrProvider) as ERC20TokenMock;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mockMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506107ae806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a35760003560e01c80633950935111610076578063a457c2d71161005b578063a457c2d7146101f9578063a9059cbb14610232578063dd62ed3e1461026b576100a3565b8063395093511461018d57806370a08231146101c6576100a3565b8063095ea7b3146100a857806318160ddd146100f557806323b872dd1461010f578063378934b414610152575b600080fd5b6100e1600480360360408110156100be57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356102a6565b604080519115158252519081900360200190f35b6100fd6102bc565b60408051918252519081900360200190f35b6100e16004803603606081101561012557600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135811691602081013590911690604001356102c2565b61018b6004803603604081101561016857600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610320565b005b6100e1600480360360408110156101a357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813516906020013561032e565b6100fd600480360360208110156101dc57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610371565b6100e16004803603604081101561020f57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610399565b6100e16004803603604081101561024857600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356103dc565b6100fd6004803603604081101561028157600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813581169160200135166103e9565b60006102b3338484610421565b50600192915050565b60025490565b60006102cf8484846104d0565b73ffffffffffffffffffffffffffffffffffffffff841660009081526001602090815260408083203380855292529091205461031691869161031190866105c3565b610421565b5060019392505050565b61032a828261063a565b5050565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490916102b391859061031190866106fd565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490916102b391859061031190866105c3565b60006102b33384846104d0565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b73ffffffffffffffffffffffffffffffffffffffff821661044157600080fd5b73ffffffffffffffffffffffffffffffffffffffff831661046157600080fd5b73ffffffffffffffffffffffffffffffffffffffff808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b73ffffffffffffffffffffffffffffffffffffffff82166104f057600080fd5b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205461052090826105c3565b73ffffffffffffffffffffffffffffffffffffffff808516600090815260208190526040808220939093559084168152205461055c90826106fd565b73ffffffffffffffffffffffffffffffffffffffff8084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008282111561063457604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f536166654d617468237375623a20554e444552464c4f57000000000000000000604482015290519081900360640190fd5b50900390565b73ffffffffffffffffffffffffffffffffffffffff821661065a57600080fd5b60025461066790826106fd565b60025573ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205461069a90826106fd565b73ffffffffffffffffffffffffffffffffffffffff83166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b60008282018381101561077157604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f536166654d617468236164643a204f564552464c4f5700000000000000000000604482015290519081900360640190fd5b939250505056fea26469706673582212209428ec7f92f95a8a4d366329b5ee128adbb7aaa51a3749fc3f47bcf6258ff85564736f6c63430007040033";
