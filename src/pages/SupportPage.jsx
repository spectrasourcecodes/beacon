import React, { useState } from 'react';
import { 
  Send, 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { clsx } from 'clsx';

const faqs = [
  {
    question: 'Como faço para sacar meus fundos?',
    answer: 'Acesse o menu "Sacar" na barra inferior, escolha entre PIX ou Bitcoin, preencha os dados e confirme. O saque será processado após aprovação do administrador.'
  },
  {
    question: 'Quanto tempo leva para um saque ser aprovado?',
    answer: 'Os saques são analisados em até 24 horas úteis. Você receberá uma notificação quando seu saque for aprovado ou rejeitado.'
  },
  {
    question: 'Como funciona o lucro de investimento?',
    answer: 'Seus investimentos geram lucro diariamente com base nas taxas de rendimento do plano escolhido. O lucro é creditado automaticamente em sua carteira.'
  },
  {
    question: 'Preciso de um PIN para sacar?',
    answer: 'Sim, por segurança você precisa criar um PIN de 4 dígitos. O PIN deve ser aprovado pelo administrador antes de poder realizar saques.'
  },
  {
    question: 'Como entro em contato com o suporte?',
    answer: 'Você pode nos contatar via Telegram, WhatsApp, e-mail ou telefone. Todos os canais estão disponíveis abaixo.'
  },
];

export const SupportPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Suporte" />
      
      <div className="px-5 pt-6">
        {/* Support Channels */}
        <div className="space-y-3">
          <h2 className="text-h3 font-bold">Canais de Atendimento</h2>
          
          <Button
            variant="telegram"
            fullWidth
            icon={<Send className="h-5 w-5" />}
            onClick={() => window.open('https://t.me/bancoprofi', '_blank')}
          >
            Suporte via Telegram
          </Button>
          
          <Button
            variant="whatsapp"
            fullWidth
            icon={<MessageCircle className="h-5 w-5" />}
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
          >
            Suporte via WhatsApp
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            icon={<Mail className="h-5 w-5" />}
            onClick={() => window.location.href = 'mailto:suporte@bancoprofi.com'}
          >
            E-mail: suporte@bancoprofi.com
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            icon={<Phone className="h-5 w-5" />}
            onClick={() => window.location.href = 'tel:+5511999999999'}
          >
            Telefone: (11) 99999-9999
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-h3 font-bold mb-4">Perguntas Frequentes</h2>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-body-strong font-semibold flex-1 pr-4">
                    {faq.question}
                  </span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                
                {expandedFAQ === index && (
                  <div className="mt-3 pt-3 border-t border-divider">
                    <p className="text-body text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Help Center Link */}
        <div className="mt-8 p-4 bg-primary-soft rounded-2xl text-center">
          <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="text-h3 font-bold text-primary">Precisa de mais ajuda?</h3>
          <p className="text-label text-muted-foreground mt-1">
            Nossa equipe está disponível 24/7 para ajudá-lo
          </p>
        </div>
      </div>
    </div>
  );
};