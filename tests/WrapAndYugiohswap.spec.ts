import * as ethers from 'ethers'

import {
  AbstractContract,
  expect,
  RevertError,
  getBuyTokenData,
  getSellTokenData,
  getAddLiquidityData,
  getRemoveLiquidityData
} from './utils'

import * as utils from './utils'

import {
  ERC1155Mock,
  YugiohswapExchange,
  YugiohswapFactory,
  WrapAndYugiohswap
} from 'src/gen/typechain'

import { ERC20Mock, ERC20Wrapper } from '@0xsequence/erc20-meta-token'

import { abi as exchangeABI } from '@0xsequence/yugiohswap/artifacts/contracts/exchange/YugiohswapExchange.sol/YugiohswapExchange.json'
import { BigNumber } from 'ethers'
import { web3 } from 'hardhat'

// init test wallets from package.json mnemonic

const { wallet: ownerWallet, provider: ownerProvider, signer: ownerSigner } = utils.createTestWallet(web3, 0)

const { wallet: userWallet, provider: userProvider, signer: userSigner } = utils.createTestWallet(web3, 2)

const { wallet: operatorWallet, provider: operatorProvider, signer: operatorSigner } = utils.createTestWallet(web3, 4)

const { wallet: randomWallet, provider: randomProvider, signer: randomSigner } = utils.createTestWallet(web3, 5)

const getBig = (id: number) => BigNumber.from(id)

describe('WrapAndSwap', () => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

  let ownerAddress: string
  let userAddress: string
  let operatorAddress: string
  let erc1155Abstract: AbstractContract
  let yugiohswapFactoryAbstract: AbstractContract
  let erc20Abstract: AbstractContract
  let tokenWrapperAbstract: AbstractContract
  let wrapAndYugiohswapAbstract: AbstractContract

  // BEP-1155 token
  let ownerERC1155Contract: ERC1155Mock
  let userERC1155Contract: ERC1155Mock
  let operatorERC1155Contract: ERC1155Mock

  // BEP-1155 token
  let ownerERC20Contract: ERC20Mock
  let userERC20Contract: ERC20Mock
  let operatorERC20Contract: ERC20Mock

  // Wrapper contract
  let ownerTokenWrapper: ERC20Wrapper
  let userTokenWrapper: ERC20Wrapper
  let operatorTokenWrapper: ERC20Wrapper

  // Wrap and Swap contract
  let ownerWrapAndYugiohswap: WrapAndYugiohswap
  let userWrapAndYugiohswap: WrapAndYugiohswap

  // Yugiohswap exchange
  let yugiohswapFactoryContract: YugiohswapFactory
  let yugiohswapExchangeContract: YugiohswapExchange

  // Contract addresses
  let erc20: string
  let erc1155: string
  let exchange: string
  let wrapAndSwap: string

  // Token Param
  const nTokenTypes = 30 //560
  const nTokensPerType = 500000

  // Currency Param
  const currencyAmount = BigNumber.from(10000000).mul(BigNumber.from(10).pow(18))
  const currencyID = 2

  // Add liquidity data
  const tokenAmountToAdd = BigNumber.from(300)
  const currencyAmountToAdd = BigNumber.from(10)
    .pow(18)
    .mul(299)

  // Transactions parameters
  const TX_PARAM = { gasLimit: 5000000 }

  const deadline = Math.floor(Date.now() / 1000) + 100000

  // Arrays
  const types = new Array(nTokenTypes).fill('').map((a, i) => getBig(i))
  const values = new Array(nTokenTypes).fill('').map((a, i) => nTokensPerType)
  const currencyAmountsToAdd: BigNumber[] = new Array(nTokenTypes).fill('').map((a, i) => currencyAmountToAdd)
  const tokenAmountsToAdd: BigNumber[] = new Array(nTokenTypes).fill('').map((a, i) => tokenAmountToAdd)
  const addLiquidityData: string = getAddLiquidityData(currencyAmountsToAdd, deadline)

  // load contract abi and deploy to test server
  before(async () => {
    ownerAddress = await ownerWallet.getAddress()
    userAddress = await userWallet.getAddress()
    operatorAddress = await operatorWallet.getAddress()
    erc1155Abstract = await AbstractContract.fromArtifactName('ERC1155Mock')
    yugiohswapFactoryAbstract = await AbstractContract.fromArtifactName('YugiohswapFactory')
    erc20Abstract = await AbstractContract.fromArtifactName('ERC20TokenMock')
    tokenWrapperAbstract = await AbstractContract.fromArtifactName('ERC20WrapperMock')
    wrapAndYugiohswapAbstract = await AbstractContract.fromArtifactName('WrapAndYugiohswap')
  })

  // deploy before each test, to reset state of contract
  beforeEach(async () => {
    // Deploy BEP-1155
    ownerERC1155Contract = (await erc1155Abstract.deploy(ownerWallet)) as ERC1155Mock
    operatorERC1155Contract = (await ownerERC1155Contract.connect(operatorSigner)) as ERC1155Mock
    userERC1155Contract = (await ownerERC1155Contract.connect(userSigner)) as ERC1155Mock

    // Deploy Currency Token contract
    ownerERC20Contract = (await erc20Abstract.deploy(ownerWallet)) as ERC20Mock
    userERC20Contract = (await ownerERC20Contract.connect(userSigner)) as ERC20Mock
    operatorERC20Contract = (await ownerERC20Contract.connect(operatorSigner)) as ERC20Mock

    // Deploy token wrapper contract
    ownerTokenWrapper = (await tokenWrapperAbstract.deploy(ownerWallet)) as ERC20Wrapper
    userTokenWrapper = (await ownerTokenWrapper.connect(userSigner)) as ERC20Wrapper
    operatorTokenWrapper = (await ownerTokenWrapper.connect(operatorSigner)) as ERC20Wrapper

    // Deploy Yugiohswap factory
    yugiohswapFactoryContract = (await yugiohswapFactoryAbstract.deploy(ownerWallet)) as YugiohswapFactory

    // Create exchange contract for the BEP-1155 token
    await yugiohswapFactoryContract.functions.createExchange(ownerERC1155Contract.address, ownerTokenWrapper.address, currencyID)

    // Retrieve exchange address
    const exchangeAddress = (
      await yugiohswapFactoryContract.functions.tokensToExchange(
        ownerERC1155Contract.address,
        ownerTokenWrapper.address,
        currencyID
      )
    )[0]

    // Type exchange contract
    yugiohswapExchangeContract = (await new ethers.Contract(exchangeAddress, exchangeABI, ownerProvider)) as YugiohswapExchange

    //Register addresses
    erc20 = ownerERC20Contract.address
    erc1155 = ownerERC1155Contract.address
    exchange = exchangeAddress

    // Register ERC-20 in tokenWrapper
    await ownerERC20Contract.functions.mockMint(ownerAddress, 1)
    await ownerERC20Contract.functions.approve(ownerTokenWrapper.address, 1)
    await ownerTokenWrapper.functions.deposit(erc20, ownerAddress, 1)

    // Deploy WrapAndYugiohswap
    ownerWrapAndYugiohswap = (await wrapAndYugiohswapAbstract.deploy(ownerWallet, [
      ownerTokenWrapper.address,
      exchange,
      erc20,
      erc1155
    ])) as WrapAndYugiohswap
    userWrapAndYugiohswap = (await ownerWrapAndYugiohswap.connect(userSigner)) as WrapAndYugiohswap
    wrapAndSwap = ownerWrapAndYugiohswap.address

    // Mint Token to owner and user
    await ownerERC1155Contract.functions.batchMintMock(operatorAddress, types, values, [])
    await ownerERC1155Contract.functions.batchMintMock(userAddress, types, values, [])

    // Mint Currency token to owner and user
    await ownerERC20Contract.functions.mockMint(operatorAddress, currencyAmountToAdd.mul(nTokenTypes))
    await ownerERC20Contract.functions.mockMint(userAddress, currencyAmount)

    // Wrap some tokens for yugiohswap liquidity
    await operatorERC20Contract.functions.approve(
      ownerTokenWrapper.address,
      BigNumber.from(2)
        .pow(256)
        .sub(1)
    )
    await operatorTokenWrapper.functions.deposit(
      operatorERC20Contract.address,
      operatorAddress,
      currencyAmountToAdd.mul(nTokenTypes)
    )

    // Authorize Yugiohswap to transfer funds on your behalf for addLiquidity & transfers
    await operatorTokenWrapper.functions.setApprovalForAll(yugiohswapExchangeContract.address, true)
    await operatorERC1155Contract.functions.setApprovalForAll(yugiohswapExchangeContract.address, true)

    // Deposit initial liquidity
    await operatorERC1155Contract.functions.safeBatchTransferFrom(
      operatorAddress,
      exchangeAddress,
      types,
      tokenAmountsToAdd,
      addLiquidityData,
      TX_PARAM
    )

    // User approves wrapAndSwap
    await userERC20Contract.functions.approve(
      userWrapAndYugiohswap.address,
      BigNumber.from(2)
        .pow(256)
        .sub(1),
      TX_PARAM
    )
  })

  describe('wrapAndSwap() function', () => {
    const tokenAmountToBuy = BigNumber.from(50)
    const tokensAmountsToBuy: BigNumber[] = new Array(nTokenTypes).fill('').map((a, i) => tokenAmountToBuy)
    let buyTokenData: string
    let cost: BigNumber

    beforeEach(async () => {
      cost = (await yugiohswapExchangeContract.functions.getPrice_currencyToToken([0], [tokenAmountToBuy]))[0][0]
      cost = cost.mul(nTokenTypes)
      buyTokenData = getBuyTokenData(ZERO_ADDRESS, types, tokensAmountsToBuy, deadline)
    })

    it('should revert if order recipient is not swapAndWrap contract', async () => {
      let bad_buyTokenData = getBuyTokenData(userAddress, types, tokensAmountsToBuy, deadline)
      const tx = userWrapAndYugiohswap.functions.wrapAndSwap(cost, userAddress, bad_buyTokenData, { gasLimit: 10000000 })
      await expect(tx).to.be.rejectedWith(RevertError('WrapAndYugiohswap#wrapAndSwap: ORDER RECIPIENT MUST BE THIS CONTRACT'))
    })

    it('should buy tokens when balances are sufficient', async () => {
      const tx = userWrapAndYugiohswap.functions.wrapAndSwap(cost, userAddress, buyTokenData, { gasLimit: 10000000 })
      await expect(tx).to.be.fulfilled
    })

    it('should buy the 2nd time as well', async () => {
      await userWrapAndYugiohswap.functions.wrapAndSwap(cost, userAddress, buyTokenData, { gasLimit: 10000000 })
      let cost2 = (await yugiohswapExchangeContract.functions.getPrice_currencyToToken([0], [tokenAmountToBuy]))[0][0]
      cost2 = cost.mul(nTokenTypes)
      let buyTokenData2 = getBuyTokenData(ZERO_ADDRESS, types, tokensAmountsToBuy, deadline)
      let tx = userWrapAndYugiohswap.functions.wrapAndSwap(cost2, userAddress, buyTokenData2, { gasLimit: 10000000 })
      await expect(tx).to.be.fulfilled
    })

    context('When wrapAndSwap is completed', () => {
      beforeEach(async () => {
        await userWrapAndYugiohswap.functions.wrapAndSwap(cost.add(100), userAddress, buyTokenData, { gasLimit: 10000000 })
      })

      it('should update Tokens balances if it passes', async () => {
        for (let i = 0; i < types.length; i++) {
          const exchangeBalance = await userERC1155Contract.functions.balanceOf(yugiohswapExchangeContract.address, types[i])
          const userBalance = await userERC1155Contract.functions.balanceOf(userAddress, types[i])

          expect(exchangeBalance[0]).to.be.eql(tokenAmountToAdd.sub(tokenAmountToBuy))
          expect(userBalance[0]).to.be.eql(BigNumber.from(nTokensPerType).add(tokenAmountToBuy))
        }
      })

      it('should update currency balances if it passes', async () => {
        const exchangeBalance = await userTokenWrapper.functions.balanceOf(yugiohswapExchangeContract.address, currencyID)
        const userBalance = await userERC20Contract.functions.balanceOf(userAddress)

        expect(exchangeBalance[0]).to.be.eql(currencyAmountToAdd.mul(nTokenTypes).add(cost))
        expect(userBalance[0]).to.be.eql(currencyAmount.sub(cost))
      })

      it('should leave swapAndWrap contract with 0 funds', async () => {
        const erc20Balance = await userERC20Contract.functions.balanceOf(userWrapAndYugiohswap.address)
        const wrappedTokenBalance = await userTokenWrapper.functions.balanceOf(userWrapAndYugiohswap.address, currencyID)

        let addresses = new Array(nTokenTypes).fill('').map((a, i) => userWrapAndYugiohswap.address)
        const erc1155Balances = await userERC1155Contract.functions.balanceOfBatch(addresses, types)

        expect(erc20Balance[0]).to.be.eql(ethers.constants.Zero)
        expect(wrappedTokenBalance[0]).to.be.eql(ethers.constants.Zero)
        for (let i = 0; i < types.length; i++) {
          expect(erc1155Balances[0][i]).to.be.eql(ethers.constants.Zero)
        }
      })
    })
  })

  describe('swapAndUnwrap() function', () => {
    const tokenAmountToSell = BigNumber.from(50)
    const tokensAmountsToSell: BigNumber[] = new Array(nTokenTypes).fill('').map((a, i) => tokenAmountToSell)
    let sellTokenData: string
    let expectedAmount

    beforeEach(async () => {
      // Sell
      const price = (await yugiohswapExchangeContract.functions.getPrice_tokenToCurrency([0], [tokenAmountToSell]))[0]
      expectedAmount = price[0].mul(nTokenTypes)
      sellTokenData = getSellTokenData(ZERO_ADDRESS, expectedAmount, deadline)
    })

    it('should revert if order recipient is not swapAndWrap contract', async () => {
      let bad_sellTokenData = getSellTokenData(userAddress, expectedAmount, deadline)
      const tx = userERC1155Contract.functions.safeBatchTransferFrom(
        userAddress,
        wrapAndSwap,
        types,
        tokensAmountsToSell,
        bad_sellTokenData,
        { gasLimit: 10000000 }
      )
      await expect(tx).to.be.rejectedWith(
        RevertError('WrapAndYugiohswap#onERC1155BatchReceived: ORDER RECIPIENT MUST BE THIS CONTRACT')
      )
    })

    it('should sell tokens when balances are sufficient', async () => {
      const tx = userERC1155Contract.functions.safeBatchTransferFrom(
        userAddress,
        wrapAndSwap,
        types,
        tokensAmountsToSell,
        sellTokenData,
        TX_PARAM
      )
      await expect(tx).to.be.fulfilled
    })

    it('should sell the 2nd time as well', async () => {
      await userERC1155Contract.functions.safeBatchTransferFrom(
        userAddress,
        wrapAndSwap,
        types,
        tokensAmountsToSell,
        sellTokenData,
        TX_PARAM
      )
      let price2 = (await yugiohswapExchangeContract.functions.getPrice_tokenToCurrency([0], [tokenAmountToSell]))[0]
      let expectedAmount2 = price2[0].mul(nTokenTypes)
      let sellTokenData2 = getSellTokenData(ZERO_ADDRESS, expectedAmount2, deadline)
      let tx = userERC1155Contract.functions.safeBatchTransferFrom(
        userAddress,
        wrapAndSwap,
        types,
        tokensAmountsToSell,
        sellTokenData2,
        TX_PARAM
      )
      await expect(tx).to.be.fulfilled
    })

    context('When wrapAndSwap is completed', () => {
      beforeEach(async () => {
        await userERC1155Contract.functions.safeBatchTransferFrom(
          userAddress,
          wrapAndSwap,
          types,
          tokensAmountsToSell,
          sellTokenData,
          TX_PARAM
        )
      })

      it('should update Tokens balances if it passes', async () => {
        for (let i = 0; i < types.length; i++) {
          const exchangeBalance = await userERC1155Contract.functions.balanceOf(yugiohswapExchangeContract.address, types[i])
          const userBalance = await userERC1155Contract.functions.balanceOf(userAddress, types[i])

          expect(exchangeBalance[0]).to.be.eql(tokenAmountToAdd.add(tokenAmountToSell))
          expect(userBalance[0]).to.be.eql(BigNumber.from(nTokensPerType).sub(tokenAmountToSell))
        }
      })

      it('should update currency balances if it passes', async () => {
        const exchangeBalance = await userTokenWrapper.functions.balanceOf(yugiohswapExchangeContract.address, currencyID)
        const userBalance = await userERC20Contract.functions.balanceOf(userAddress)

        expect(exchangeBalance[0]).to.be.eql(currencyAmountToAdd.mul(nTokenTypes).sub(expectedAmount))
        expect(userBalance[0]).to.be.eql(currencyAmount.add(expectedAmount))
      })

      it('should leave swapAndWrap contract with 0 funds', async () => {
        const erc20Balance = await userERC20Contract.functions.balanceOf(userWrapAndYugiohswap.address)
        const wrappedTokenBalance = await userTokenWrapper.functions.balanceOf(userWrapAndYugiohswap.address, currencyID)

        let addresses = new Array(nTokenTypes).fill('').map((a, i) => userWrapAndYugiohswap.address)
        const erc1155Balances = await userERC1155Contract.functions.balanceOfBatch(addresses, types)

        expect(erc20Balance[0]).to.be.eql(ethers.constants.Zero)
        expect(wrappedTokenBalance[0]).to.be.eql(ethers.constants.Zero)
        for (let i = 0; i < types.length; i++) {
          expect(erc1155Balances[0][i]).to.be.eql(ethers.constants.Zero)
        }
      })
    })
  })
})
