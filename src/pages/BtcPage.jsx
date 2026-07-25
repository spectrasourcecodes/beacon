import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { withdrawalApi } from '../api/withdrawal';
import { useWallet } from '../context/WalletContext';
import { toast } from 'sonner';
import { Bitcoin } from 'lucide-react';
import { IconPill } from '../components/shared/IconPill';

export const BtcPage = () => {
  const navigate = useNavigate();
  const { refreshWallet } = useWallet();
  const [btcAddress, setBtcAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!btcAddress.trim() || btcAddress.length < 26) {
      newErrors.btcAddress = 'Endereço BTC inválido';
    }
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Valor inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await withdrawalApi.createWithdrawal({
        method: 'btc',
        btcAddress: btcAddress.trim(),
        amount: parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.')),
      });
      toast.success('Saque BTC solicitado com sucesso!');
      await refreshWallet();
      navigate('/withdraw/pin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao solicitar saque');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Saque Bitcoin" />
      
      <div className="px-5 pt-6">
        <div className="flex flex-col items-center mb-8">
          <IconPill 
            icon={Bitcoin} 
            bg="bg-bitcoin/10" 
            iconColor="text-bitcoin" 
          />
          <h2 className="text-h3 font-bold mt-3">Transferência para carteira BTC</h2>
          <p className="text-label text-muted-foreground text-center mt-1">
            Insira o endereço da sua carteira Bitcoin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="btcAddress"
            label="Endereço BTC"
            placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
            value={btcAddress}
            onChange={(e) => setBtcAddress(e.target.value)}
            error={errors.btcAddress}
            required
          />
          
          <Input
            id="amount"
            type="currency"
            label="Valor (R$)"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Transferir BTC
          </Button>
        </form>
      </div>
    </div>
  );
};