'use client';

import { useCallback, useEffect, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import {
  getCommunicationPreferences,
  updateCommunicationPreferences,
} from '@/graphql/communication';
import type {
  CommunicationPreferences,
  UpdateCommunicationPreferencesInput,
} from '@/types/communication-user';
import { getSafeErrorMessage } from '@/lib/error-utils';
import { useAuth } from '@/contexts/AuthContext';

export function useCommunicationPreferences() {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<CommunicationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreferences = useCallback(async () => {
    if (!isAuthenticated) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await GraphQLClient.executeAuthenticated<{
        getCommunicationPreferences: CommunicationPreferences;
      }>(getCommunicationPreferences);
      setPreferences(data.getCommunicationPreferences);
    } catch (err) {
      setError(getSafeErrorMessage(err, 'Failed to load preferences'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const updatePreference = useCallback(
    async (patch: UpdateCommunicationPreferencesInput) => {
      if (!preferences) return false;

      setSaving(true);
      setError(null);
      const previous = preferences;
      const optimistic = { ...preferences, ...patch };
      setPreferences(optimistic);

      try {
        const data = await GraphQLClient.executeAuthenticated<{
          updateCommunicationPreferences: CommunicationPreferences;
        }>(updateCommunicationPreferences, { input: patch });
        setPreferences(data.updateCommunicationPreferences);
        return true;
      } catch (err) {
        setPreferences(previous);
        setError(getSafeErrorMessage(err, 'Failed to update preferences'));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [preferences]
  );

  return {
    preferences,
    loading,
    saving,
    error,
    loadPreferences,
    updatePreference,
  };
}
