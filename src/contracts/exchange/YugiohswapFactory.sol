// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.7.4;
import "./YugiohswapExchange.sol";
import "../interfaces/IYugiohswapFactory.sol";


contract YugiohswapFactory is IYugiohswapFactory {

  /***********************************|
  |       Events And Variables        |
  |__________________________________*/

  // tokensToExchange[erc1155_token_address][currency_address][currency_token_id]
  mapping(address => mapping(address => mapping(uint256 => address))) public override tokensToExchange;

  /***********************************|
  |            Constructor            |
  |__________________________________*/

  /**
   * @notice Creates a YugiohSwap Exchange for given token contract
   * @param _token      The address of the BEP-1155 token contract
   * @param _currency   The address of the currency token contract
   * @param _currencyID The id of the currency token
   */
  function createExchange(address _token, address _currency, uint256 _currencyID) public override {
    require(tokensToExchange[_token][_currency][_currencyID] == address(0x0), "YugiohswapFactory#createExchange: EXCHANGE_ALREADY_CREATED");

    // Create new exchange contract
    YugiohswapExchange exchange = new YugiohswapExchange(_token, _currency, _currencyID);

    // Store exchange and token addresses
    tokensToExchange[_token][_currency][_currencyID] = address(exchange);

    // Emit event
    emit NewExchange(_token, _currency, _currencyID, address(exchange));
  }

}
