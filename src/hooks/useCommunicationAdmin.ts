'use client';

import { useCallback, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import {
  listCommunicationTemplates,
  listDeliveryLogs,
  upsertCommunicationTemplate,
} from '@/graphql/communication';
import type {
  CommunicationTemplate,
  DeliveryLog,
  UpsertCommunicationTemplateInput,
} from '@/types/communication-admin';
import { getSafeErrorMessage } from '@/lib/error-utils';

export function useCommunicationAdmin() {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [logsNextToken, setLogsNextToken] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    setTemplatesError(null);
    try {
      const data = await GraphQLClient.executeAuthenticated<{
        listCommunicationTemplates: {
          templates: CommunicationTemplate[];
          count: number;
        };
      }>(listCommunicationTemplates, { limit: 100 });

      setTemplates(data.listCommunicationTemplates.templates ?? []);
    } catch (error) {
      setTemplatesError(getSafeErrorMessage(error, 'Failed to load templates'));
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  const saveTemplate = useCallback(
    async (input: UpsertCommunicationTemplateInput): Promise<CommunicationTemplate | null> => {
      setSavingTemplate(true);
      setTemplatesError(null);
      try {
        const payload: UpsertCommunicationTemplateInput = {
          ...input,
          variables: input.variables?.filter(Boolean) ?? [],
          emailSubject: input.emailSubject?.trim() || undefined,
          emailBody: input.emailBody?.trim() || undefined,
          pushTitle: input.pushTitle?.trim() || undefined,
          pushBody: input.pushBody?.trim() || undefined,
          inAppTitle: input.inAppTitle?.trim() || undefined,
          inAppBody: input.inAppBody?.trim() || undefined,
        };

        const data = await GraphQLClient.executeAuthenticated<{
          upsertCommunicationTemplate: CommunicationTemplate;
        }>(upsertCommunicationTemplate, { input: payload });

        const saved = data.upsertCommunicationTemplate;
        setTemplates((prev) => {
          const idx = prev.findIndex((t) => t.templateId === saved.templateId);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        return saved;
      } catch (error) {
        setTemplatesError(getSafeErrorMessage(error, 'Failed to save template'));
        return null;
      } finally {
        setSavingTemplate(false);
      }
    },
    []
  );

  const loadDeliveryLogs = useCallback(
    async (options?: { eventType?: string; append?: boolean; nextToken?: string | null }) => {
      setLogsLoading(true);
      setLogsError(null);
      try {
        const data = await GraphQLClient.executeAuthenticated<{
          listDeliveryLogs: {
            logs: DeliveryLog[];
            nextToken?: string | null;
            count: number;
          };
        }>(listDeliveryLogs, {
          limit: 50,
          nextToken: options?.append ? options.nextToken ?? logsNextToken : undefined,
          eventType: options?.eventType || undefined,
        });

        const fetched = data.listDeliveryLogs.logs ?? [];
        setLogsNextToken(data.listDeliveryLogs.nextToken ?? null);
        setLogs((prev) => (options?.append ? [...prev, ...fetched] : fetched));
      } catch (error) {
        setLogsError(getSafeErrorMessage(error, 'Failed to load delivery logs'));
      } finally {
        setLogsLoading(false);
      }
    },
    [logsNextToken]
  );

  return {
    templates,
    templatesLoading,
    templatesError,
    savingTemplate,
    loadTemplates,
    saveTemplate,
    logs,
    logsLoading,
    logsError,
    logsNextToken,
    loadDeliveryLogs,
  };
};
