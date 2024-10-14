import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const CryptoProfitCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [buyFee, setBuyFee] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [sellFee, setSellFee] = useState('');
  const [matchFees, setMatchFees] = useState(false);
  const [profit, setProfit] = useState(null);
  const [effectiveAmount, setEffectiveAmount] = useState(null);
  const [priceIncrease, setPriceIncrease] = useState(null);
  const [feePercentage, setFeePercentage] = useState(null);

  useEffect(() => {
    calculateEffectiveAmount();
    calculatePriceIncrease();
    calculateFeePercentage();
  }, [purchasePrice, purchaseAmount, buyFee, salePrice]);

  useEffect(() => {
    if (matchFees && feePercentage !== null) {
      const saleAmount = parseFormattedNumber(salePrice) * parseFloat(effectiveAmount);
      const matchedSellFee = (feePercentage / 100 * saleAmount).toFixed(2);
      setSellFee(formatNumber(matchedSellFee));
    }
  }, [matchFees, feePercentage, salePrice, effectiveAmount]);

  const formatNumber = (value) => {
    const parts = String(value).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const handleNumberInput = (value, setter) => {
    const cleanedValue = value.replace(/[^\d.]/g, '');
    const parts = cleanedValue.split('.');
    const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    setter(formatNumber(formattedValue));
  };

  const parseFormattedNumber = (value) => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const calculateEffectiveAmount = () => {
    const price = parseFormattedNumber(purchasePrice);
    const amount = parseFloat(purchaseAmount) || 0;
    const fee = parseFormattedNumber(buyFee);

    if (price > 0 && amount > 0) {
      const totalCost = price * amount + fee;
      const effectiveAmt = (price * amount) / totalCost * amount;
      setEffectiveAmount(effectiveAmt.toFixed(8));
    } else {
      setEffectiveAmount(null);
    }
  };

  const calculatePriceIncrease = () => {
    const buyPrice = parseFormattedNumber(purchasePrice);
    const sellPrice = parseFormattedNumber(salePrice);

    if (buyPrice > 0 && sellPrice > 0) {
      const increase = ((sellPrice - buyPrice) / buyPrice) * 100;
      setPriceIncrease(increase.toFixed(2));
    } else {
      setPriceIncrease(null);
    }
  };

  const calculateFeePercentage = () => {
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
  };

  const calculateProfit = () => {
    const buyPrice = parseFormattedNumber(purchasePrice);
    const amount = parseFloat(effectiveAmount) || 0;
    const sellPrice = parseFormattedNumber(salePrice);
    const buyFeeAmount = parseFormattedNumber(buyFee);
    const sellFeeAmount = parseFormattedNumber(sellFee);
    
    if (buyPrice > 0 && amount > 0 && sellPrice > 0) {
      const totalCost = buyPrice * parseFloat(purchaseAmount) + buyFeeAmount;
      const totalRevenue = sellPrice * amount - sellFeeAmount;
      const profitValue = totalRevenue - totalCost;
      setProfit(profitValue.toFixed(2));
    } else {
      setProfit(null);
    }
  };

  const clearValues = () => {
    setPurchasePrice('');
    setPurchaseAmount('');
    setBuyFee('');
    setSalePrice('');
    setSellFee('');
    setMatchFees(false);
    setProfit(null);
    setEffectiveAmount(null);
    setPriceIncrease(null);
    setFeePercentage(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crypto Profit Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buying Information</CardTitle>
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
                  placeholder="Enter number of coins purchased"
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
                    This fee is approximately {feePercentage}% of the total purchase amount.
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
              <CardTitle className="text-lg">Selling Information</CardTitle>
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
                  onCheckedChange={setMatchFees}
                />
                <Label htmlFor="matchFees">
                  Match fee percentage
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
                Profit: ${formatNumber(profit)}
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