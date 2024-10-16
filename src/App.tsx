import { useState, useEffect, useCallback } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckedState } from '@radix-ui/react-checkbox'
import { Coins, CircleDollarSign, Earth } from 'lucide-react';
import previewImage from './assets/calculator.jpg';
import { Helmet } from 'react-helmet';

const CryptoProfitCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [buyFee, setBuyFee] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [sellFee, setSellFee] = useState('');
  const [matchFees, setMatchFees] = useState(false);
  const [profit, setProfit] = useState<string | null>(null);
  const [profitPercentage, setProfitPercentage] = useState<string | null>(null);
  const [effectiveAmount, setEffectiveAmount] = useState<string>('0');
  const [priceIncrease, setPriceIncrease] = useState<string | null>(null);
  const [feePercentage, setFeePercentage] = useState<string | null>(null);
  const [sellFeePercentage, setSellFeePercentage] = useState<string | null>(null);

  const fullImageUrl = new URL(previewImage, window.location.origin).href;

  const formatNumber = (value: string | number) => {
    const parts = String(value).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const handleNumberInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const cleanedValue = value.replace(/[^\d.]/g, '');
    const parts = cleanedValue.split('.');
    const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    setter(formatNumber(formattedValue));
  };

  const parseFormattedNumber = (value: string) => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const calculateEffectiveAmount = useCallback(() => {
    const price = parseFormattedNumber(purchasePrice);
    const amount = parseFloat(purchaseAmount) || 0;
    const fee = parseFormattedNumber(buyFee);
  
    if (price > 0 && amount > 0) {
      const totalCost = price * amount + fee;
      return ((price * amount) / totalCost * amount).toFixed(8);
    }
    return '0';
  }, [purchasePrice, purchaseAmount, buyFee]);

  const calculatePriceIncrease = useCallback(() => {
    const buyPrice = parseFormattedNumber(purchasePrice);
    const sellPrice = parseFormattedNumber(salePrice);
  
    if (buyPrice > 0 && sellPrice > 0) {
      const increase = ((sellPrice - buyPrice) / buyPrice) * 100;
      return increase.toFixed(2);
    }
    return null;
  }, [purchasePrice, salePrice]);

  const calculateFeePercentage = useCallback(() => {
    const price = parseFormattedNumber(purchasePrice);
    const amount = parseFloat(purchaseAmount) || 0;
    const fee = parseFormattedNumber(buyFee);
  
    if (price > 0 && amount > 0 && fee > 0) {
      const totalPurchase = price * amount;
      const percentage = (fee / totalPurchase) * 100;
      return percentage.toFixed(2);
    }
    return null;
  }, [purchasePrice, purchaseAmount, buyFee]);

  //calculate sell fee percentage and return value
  const calculateSellFeePercentage = useCallback(() => {
    const price = parseFormattedNumber(salePrice);
    const amount = parseFloat(purchaseAmount) || 0;
    const fee = parseFormattedNumber(sellFee);
  
    if (price > 0 && amount > 0 && fee > 0) {
      const percentage = (fee / (price * amount)) * 100;
      return percentage.toFixed(2);
    }
    return null;
  }, [salePrice, purchaseAmount, sellFee]);

  const calculateProfit = useCallback(() => {
    const buyPrice = parseFormattedNumber(purchasePrice);
    const amount = parseFloat(purchaseAmount) || 0;
    const sellPrice = parseFormattedNumber(salePrice);
    const buyFeeAmount = parseFormattedNumber(buyFee);
    const sellFeeAmount = parseFormattedNumber(sellFee);
    
    if (buyPrice > 0 && amount > 0 && sellPrice > 0) {
      const totalCost = (buyPrice * amount) + buyFeeAmount;
      const totalRevenue = (sellPrice * amount) - sellFeeAmount;
      const profitValue = totalRevenue - totalCost;
      const profitPercentageValue = ((profitValue / totalCost) * 100).toFixed(2);
      
      return {
        profit: profitValue.toFixed(2),
        profitPercentage: profitPercentageValue
      };
    }
    return { profit: null, profitPercentage: null };
  }, [purchasePrice, purchaseAmount, salePrice, buyFee, sellFee]);

  //bug fix due to This error is related to a type mismatch between the onCheckedChange prop of the Checkbox component and the setMatchFees function. Let's address this.
  const handleCheckboxChange = (checked: CheckedState) => {
    setMatchFees(checked == true);
  };


  // start recal on change
  const calculateAll = useCallback(() => {
    
    
    // Calculate effective amount
    const effectiveAmt = calculateEffectiveAmount();
    setEffectiveAmount(effectiveAmt);

    // Calculate price increase
    const priceIncreaseValue = calculatePriceIncrease();
    setPriceIncrease(priceIncreaseValue);

    // Calculate fee percentage
    const feePercentageValue = calculateFeePercentage();
    setFeePercentage(feePercentageValue);

    // Calculate sell fee percentage
    const sellfeePercentageValue = calculateSellFeePercentage();
    setSellFeePercentage(sellfeePercentageValue);

    // Calculate profit
    const { profit, profitPercentage } = calculateProfit();
    setProfit(profit);
    setProfitPercentage(profitPercentage);
    
  }, [calculateEffectiveAmount, calculatePriceIncrease, calculateFeePercentage, calculateSellFeePercentage, calculateProfit]);

  useEffect(() => {
    calculateAll();
  }, [calculateAll]);

  useEffect(() => {
    if (matchFees && feePercentage !== null) {
      const saleAmount = parseFormattedNumber(salePrice) * parseFloat(effectiveAmount || '0');
      const feePercentageNumber = parseFloat(feePercentage);
      if (!isNaN(feePercentageNumber)) {
        const matchedBuyFee = ((feePercentageNumber / 100) * saleAmount).toFixed(2);
        setSellFee(formatNumber(matchedBuyFee));
      }
    }
  }, [matchFees, feePercentage, salePrice, effectiveAmount]);
  // end recal on change


  useEffect(() => {
    const buyFeePercentage = calculateFeePercentage();
    setFeePercentage(buyFeePercentage);

    const sellFeePercentage = calculateSellFeePercentage();
    setSellFeePercentage(sellFeePercentage);
  }, [calculateFeePercentage, calculateSellFeePercentage]);


  const clearValues = () => {
    setPurchasePrice('');
    setPurchaseAmount('');
    setBuyFee('');
    setSalePrice('');
    setSellFee('');
    setMatchFees(false);
    setProfit(null);
    setEffectiveAmount('0');
    setPriceIncrease(null);
    setFeePercentage(null);
    setSellFeePercentage(null);
  };


  return (
    <div>
      <Helmet>
        <meta property="og:title" content="Crypto Profit Calculator" />
        <meta property="og:description" content="Calculate your cryptocurrency profits with ease. Input your buying and selling information to see your potential gains." />
        <meta property="og:image" content={fullImageUrl} />
        <meta name="google-adsense-account" content="ca-pub-6177880546372681"></meta>
      </Helmet>
        
    
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crypto Profit Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
                  Buying Price ($ per coin)
                </label>
                <Input
                  id="purchasePrice"
                  type="text"
                  inputMode='decimal'
                  value={purchasePrice}
                  onChange={(e) => handleNumberInput(e.target.value, setPurchasePrice)}
                  placeholder="Enter price per coin when buying"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="purchaseAmount" className="block text-sm font-medium text-gray-700">
                  Amount of Coins Bought
                </label>
                <Input
                  id="purchaseAmount"
                  type="number"
                  inputMode='decimal'
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="Enter number of coins being purchased"
                  className="mt-1"
                  step="any"
                />
              </div>
              <div>
                <label htmlFor="buyFee" className="block text-sm font-medium text-gray-700">
                  Purchase Fee ($)
                </label>
                <div className="relative">
                <Input
                    id="buyFee"
                    type="text"
                    inputMode='decimal'
                    value={buyFee}
                    onChange={(e) => handleNumberInput(e.target.value, setBuyFee)}
                    placeholder="Enter fee paid when buying"
                    className="mt-1"
                  />
                {feePercentage !== null && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      approx. {feePercentage}%
                    </span>
                  )}
                </div>
                
              </div>
              
              
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sell Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
                  Selling Price ($ per coin)
                </label>
                <Input
                  id="salePrice"
                  type="text"
                  inputMode='decimal'
                  value={salePrice}
                  onChange={(e) => handleNumberInput(e.target.value, setSalePrice)}
                  placeholder="Enter price per coin when selling"
                  className="mt-1"
                />
                {priceIncrease !== null && (
                    <span className="absolute right-2 top-10 transform -translate-y-1/2 text-xs text-gray-500">
                      Price change of {priceIncrease}%
                    </span>
                  )}
              </div>
              
              <div className="relative">
                <label htmlFor="sellFee" className="block text-sm font-medium text-gray-700">
                  Selling Fee ($)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the fee charged at the time of selling. If you don't know it, </p>
                        <p>use the checkbox below to match the buying fee for an estimate.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                
                <Input
                  id="sellFee"
                  type="text"
                  inputMode='decimal'
                  value={sellFee}
                  onChange={(e) => handleNumberInput(e.target.value, setSellFee)}
                  placeholder="Enter fee paid when selling"
                  className="mt-1"
                  disabled={matchFees}
                />
                {sellFeePercentage !== null && (
                    <span className="absolute right-2 top-10 transform -translate-y-1/2  text-xs text-gray-500">
                      approx. {sellFeePercentage}%
                    </span>
                  )}
              </div>
              <div className="flex items-top space-x-2 cursor-pointer">
                <Checkbox id="matchFees" checked={matchFees} onCheckedChange={handleCheckboxChange} />
                <div className="grid gap-1.5 text-left leading-none">

                <Label htmlFor="matchFees" ><p className="pb-1">Estimate Selling Fee</p>
                <p className="text-sm font-normal text-muted-foreground">
                If you don't know the selling fee, use the percentage of fees paid when buying to estimate the selling fees.
                </p>
                </Label>
              </div>
              </div>

            </CardContent>
          </Card>
          


          <Card className="lg:col-span-2 lg:max-w-md lg:mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Profile or Loss Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

            <div className="flex justify-center">
              {/* Your Profit/Loss: no STATE */}
                {profit == null && profitPercentage == null && (  
                    <div className="w-64 p-3 rounded-lg shadow-sm bg-slate-100">
                      <div className="flex items-center space-x-2">
                        <CircleDollarSign size={20} className="text-gray-600"/>
                        <span className="text-sm font-semibold text-gray-600">Your Profit/Loss</span>
                      </div>

                      <div className="mt-4 text-center">
                    <div className="text-lg font-semibold text-gray-600">
                      &nbsp;
                      </div>
                    <p className="text-md font-semibold">
                      &nbsp;
                    </p>
                  </div>
                    </div> 
                )}
              
              {/* Your Profit/Loss: with STATE */}
                {profit !== null && profitPercentage !== null && (
                  <div className={`w-64 p-3 rounded-lg shadow-sm ${parseFloat(profit) >= 0 ? 'bg-green-50 text-green-600': 'bg-red-50 text-red-600'}`}>
                    <div className="flex items-center space-x-2">
                      <CircleDollarSign size={20} />
                      <span className="text-sm font-semibold">Your Profit/Loss</span>
                    </div>

                    <div className="mt-4 text-center">
                  <div className={`text-lg font-semibold ${parseFloat(profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(profit) >= 0 ? 'Profit of ' : 'Loss of '}${Math.abs(parseFloat(profit))}
                    </div>
                  <p className={`text-md font-semibold ${parseFloat(profitPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(profitPercentage) >= 0 ? '(+' : '(-'}{Math.abs(parseFloat(profitPercentage))}% {parseFloat(profitPercentage) >= 0 ? 'Increase)' : 'Decrease)'}
                  </p>
                </div>
                  </div>
                )}
              </div>
              
              {/* Effective Coin value after fees */}
              <div className="flex justify-center">
                {effectiveAmount == '0' && (
                  <div className="w-64 p-3 bg-slate-100 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Coins className="text-grey-600" size={20} />
                      <span className="text-sm text-grey-600">Effective Coin value after fees</span>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm font-bold text-grey-600">&nbsp;</span>
                    </div>
                  </div>
                )}

                {effectiveAmount > '0' && (
                  <div className="w-64 p-3 bg-blue-50 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Coins className="text-blue-500" size={20} />
                      <span className="text-sm text-blue-700">Effective Coin value after fees</span>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm font-bold text-blue-600">{effectiveAmount}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2 flex flex-col items-center space-y-4 mt-6">
            <Button onClick={clearValues} className="w-min" variant="outline">
              Clear Values
            </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full max-w-xs">
                <Button 
                  onClick={() => window.open('https://www.buymeacoffee.com/mightycalculator', '_blank')}
                  className="w-min bg-[#5F7FFF] hover:bg-[#4B6FEF] text-white hover:text-white"
                  variant="outline"
                >
                  <Earth className="mr-2 h-4 w-4" />Help me see the world!
                </Button>
                  </TooltipTrigger>
              <TooltipContent side='bottom' className="text-center bg-slate-500">
                It's basically a donation! Because this website costs money to run.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default CryptoProfitCalculator;