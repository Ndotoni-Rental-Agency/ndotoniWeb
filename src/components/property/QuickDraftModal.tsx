'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { CreatePropertyDraft } from './CreatePropertyDraft';

interface QuickDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (propertyId: string) => void;
}

export const QuickDraftModal: React.FC<QuickDraftModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const handleSuccess = (propertyId: string) => {
    if (onSuccess) {
      onSuccess(propertyId);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <CreatePropertyDraft
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
};