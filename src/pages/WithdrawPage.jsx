import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Bitcoin } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { MethodCard } from '../components/shared/MethodCard';

export const WithdrawPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Sacar Fundos" />
      
      <div className="px-5 pt-6 pb-32">
        <h2 className="text-h2 font-bold">Escolha o método</h2>
        
        <div className="space-y-4 mt-4">
          <MethodCard
            icon={Landmark}
            title="PIX / Banco"
            subtitle="Transferência instantânea"
            iconBg="bg-primary-soft"
            iconColor="text-primary"
            onClick={() => navigate('/withdraw/pix')}
          />
          
          <MethodCard
            icon={Bitcoin}
            title="Bitcoin"
            subtitle="Transferência para carteira BTC"
            iconBg="bg-bitcoin/10"
            iconColor="text-bitcoin"
            onClick={() => navigate('/withdraw/btc')}
          />
        </div>
      </div>
    </div>
  );
};