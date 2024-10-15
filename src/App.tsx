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


const CryptoProfitCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [buyFee, setBuyFee] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [sellFee, setSellFee] = useState('');
  const [matchFees, setMatchFees] = useState(false);
  const [profit, setProfit] = useState<string | null>(null);
  const [effectiveAmount, setEffectiveAmount] = useState<string>('0');
  const [priceIncrease, setPriceIncrease] = useState<string | null>(null);
  const [feePercentage, setFeePercentage] = useState<string | null>(null);

  
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
      const effectiveAmt = (price * amount) / totalCost * amount;
      console.log('totalCost: ',totalCost);
      console.log('effectiveAmt: ', effectiveAmt);
      setEffectiveAmount(effectiveAmt.toFixed(8));
    } else {
      setEffectiveAmount('');
    }
  }, [purchasePrice, purchaseAmount, buyFee]);

  const calculatePriceIncrease = useCallback(() => {
    const buyPrice = parseFormattedNumber(purchasePrice);
    const sellPrice = parseFormattedNumber(salePrice);

    if (buyPrice > 0 && sellPrice > 0) {
      const increase = ((sellPrice - buyPrice) / buyPrice) * 100;
      setPriceIncrease(increase.toFixed(2));
    } else {
      setPriceIncrease(null);
    }
  }, [purchasePrice, salePrice]);

  const calculateFeePercentage = useCallback(() => {
    const price = parseFormattedNumber(purchasePrice);
    const amount = parseFloat(purchaseAmount) || 0;
    const fee = parseFormattedNumber(buyFee);

    if (price > 0 && amount > 0 && fee > 0) {
      const totalPurchase = price * amount;
      const percentage = (fee / totalPurchase) * 100;
      setFeePercentage(percentage.toFixed(2));
    } else {
      setFeePercentage(null);
    }
  }, [purchasePrice, purchaseAmount, buyFee]);

  const calculateProfit = () => {
    const buyPrice = parseFormattedNumber(purchasePrice);
    const amount = parseFloat(purchaseAmount) || 0;
    const sellPrice = parseFormattedNumber(salePrice);
    const buyFeeAmount = parseFormattedNumber(buyFee);
    const sellFeeAmount = parseFormattedNumber(sellFee);
    
    if (buyPrice > 0 && amount > 0 && sellPrice > 0) {
      const totalCost = (buyPrice * parseFloat(purchaseAmount)) + buyFeeAmount;
      const totalRevenue = (sellPrice * amount) - sellFeeAmount;
      const profitValue = totalRevenue - totalCost;
      console.log('*** totalCost: ', totalCost);
      console.log('*** totalRevenue: ', totalRevenue);
      console.log('***');
      console.log('*** totalRevenue: (', sellPrice, '*', amount, ') -', sellFeeAmount);
      setProfit(profitValue.toFixed(2));
    } else {
      setProfit(null);
    }
  };

  //bug fix due to This error is related to a type mismatch between the onCheckedChange prop of the Checkbox component and the setMatchFees function. Let's address this.
  const handleCheckboxChange = (checked: CheckedState) => {
    setMatchFees(checked == true);
  };

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

  useEffect(() => {
    calculateEffectiveAmount();
    calculatePriceIncrease();
    calculateFeePercentage();
  }, [calculateEffectiveAmount, calculatePriceIncrease, calculateFeePercentage]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crypto Profit Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="purchasePrice" inputMode='numeric' className="block text-sm font-medium text-gray-700">
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
                <Input
                  id="buyFee"
                  type="text"
                  value={buyFee}
                  onChange={(e) => handleNumberInput(e.target.value, setBuyFee)}
                  placeholder="Enter fee paid when buying"
                  className="mt-1"
                />
                {feePercentage !== null && (
                  <div className="mt-1 text-sm text-gray-500">
                    approx. {feePercentage}% of the purchase amount.
                  </div>
                )}
              </div>
              {effectiveAmount && (
                <div className="mt-2 text-sm text-gray-600">
                  Actual coins owned after fees: {effectiveAmount}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sell Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
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
          
          <Button onClick={calculateProfit} className="w-full">
            Calculate Profit
          </Button>
          {profit !== null && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">
                &nbsp;
                The Profit/Loss: ${formatNumber(profit)}
                &nbsp;
              </p>
            </div>
          )}
          <Button onClick={clearValues} className="w-full" variant="outline">
            Clear Values
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoProfitCalculator;