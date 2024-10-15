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
import { Coins } from 'lucide-react';

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

    // Calculate profit
    const { profit, profitPercentage } = calculateProfit();
    setProfit(profit);
    setProfitPercentage(profitPercentage);
    
  }, [calculateEffectiveAmount, calculatePriceIncrease, calculateFeePercentage, calculateProfit]);

  useEffect(() => {
    calculateAll();
  }, [calculateAll]);

  useEffect(() => {
    if (matchFees && feePercentage !== null) {
      const saleAmount = parseFormattedNumber(salePrice) * parseFloat(effectiveAmount || '0');
      const feePercentageNumber = parseFloat(feePercentage);
      if (!isNaN(feePercentageNumber)) {
        const matchedSellFee = ((feePercentageNumber / 100) * saleAmount).toFixed(2);
        setSellFee(formatNumber(matchedSellFee));
      }
    }
  }, [matchFees, feePercentage, salePrice, effectiveAmount]);
  // end recal on change


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
  };


  return (
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
                  value={salePrice}
                  onChange={(e) => handleNumberInput(e.target.value, setSalePrice)}
                  placeholder="Enter price per coin when selling"
                  className="mt-1"
                />
              </div>
              {priceIncrease !== null && (
                <div className="mt-2 text-sm text-gray-600">
                  Price change: {priceIncrease}%
                </div>
              )}
              <div>
                <label htmlFor="sellFee" className="block text-sm font-medium text-gray-700">
                  Selling Fee ($)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the fee charged at the time of selling. If you don't know this amount, </p>
                        <p>select the box below to use the buying fee as an approximate.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                
                <Input
                  id="sellFee"
                  type="text"
                  value={sellFee}
                  onChange={(e) => handleNumberInput(e.target.value, setSellFee)}
                  placeholder="Enter fee paid when selling"
                  className="mt-1"
                  disabled={matchFees}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="matchFees" 
                  checked={matchFees}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="matchFees">
                  Estimate Selling Fee
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>If you don't know the selling fee, this will use the percentage </p>
                        <p>of fees paid when bought to estimate the fees for selling.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>
            </CardContent>
          </Card>
          


          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profit == null && profitPercentage == null && (
                <div className="mt-4 text-center">
                  <div>
                    Keep going...
                    </div>
                  <p>
                    &nbsp;
                  </p>
                </div>
              )}

              {profit !== null && profitPercentage !== null && (
                <div className="mt-4 text-center">
                  <div className={`text-lg font-semibold ${parseFloat(profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(profit) >= 0 ? 'Profit of ' : 'Loss of '}${Math.abs(parseFloat(profit))}
                    </div>
                  <p className={`text-md font-semibold ${parseFloat(profitPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(profitPercentage) >= 0 ? '(+' : '(-'}{Math.abs(parseFloat(profitPercentage))}% {parseFloat(profitPercentage) >= 0 ? 'Increase)' : 'Decrease)'}
                  </p>
                </div>
              )}

              
              <div className="flex justify-center">
                {effectiveAmount && (
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
          
          
          <Button onClick={clearValues} className="w-full" variant="outline">
            Clear Values
          </Button>

          <p>To-do: make price change under selling price to be embedded more into the field.
            make the effective coin box only appear when values entered without affecting height.
          </p>
        </div>
      </CardContent>
    </Card>
    
  );
};

export default CryptoProfitCalculator;