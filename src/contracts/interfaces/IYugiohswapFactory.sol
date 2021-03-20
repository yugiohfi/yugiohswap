// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.7.4;

interface IYugiohswapFactory {

  /***********************************|
  |               Events              |
  |__________________________________*/

  event NewExchange(address indexed token, address indexed currency, uint256 indexed currencyID, address exchange);


  /***********************************|
  |         Public  Functions         |
  |__________________________________*/

  /**
   * @notice Creates a YugiohSwap Exchange for given token contract
   * @param _token      The address of the BEP-1155 token contract
   * @param _currency   The address of the currency token contract
   * @param _currencyID The id of the currency token
   */
  function createExchange(address _token, address _currency, uint256 _currencyID) external;

  /**
   * @notice Return address of exchange for corresponding BEP-1155 token contract
   * @param _token      The address of the BEP-1155 token contract
   * @param _currency   The address of the currency token contract
   * @param _currencyID The id of the currency token
   */
  function tokensToExchange(address _token, address _currency, uint256 _currencyID) external view returns (address);

}