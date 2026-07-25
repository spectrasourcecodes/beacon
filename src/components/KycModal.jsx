import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const KycModal = ({ isOpen, onClose, onSuccess }) => {
  const { verifyKyc } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Código KYC é obrigatório');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyKyc(code.trim());
      toast.success('KYC verificado com sucesso!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verificação KYC" position="center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-body text-muted-foreground">
          Para realizar saques, você precisa verificar sua identidade com um código KYC.
          Insira o código fornecido pelo administrador.
        </p>
        <Input
          id="kycCode"
          label="Código KYC"
          placeholder="Digite seu código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={error}
          required
        />
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Verificar
        </Button>
      </form>
    </Modal>
  );
};