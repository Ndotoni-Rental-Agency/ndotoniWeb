'use client';

import { useState, useEffect } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { listContactInquiries, getContactInquiryStats } from '@/graphql/queries';
import { updateContactInquiryStatus } from '@/graphql/mutations';

interface ContactInquiry {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  handledBy?: string;
}

interface InquiryStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  byType: Array<{ type: string; count: number }>;
}

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load inquiries
      const inquiriesResult = await graphqlClient.graphql({
        query: listContactInquiries,
        variables: {
          status: statusFilter || undefined,
          limit: 50,
        },
        authMode: 'userPool',
      });

      // Load stats
      const statsResult = await graphqlClient.graphql({
        query: getContactInquiryStats,
        authMode: 'userPool',
      });

      setInquiries(inquiriesResult.data.listContactInquiries.items as ContactInquiry[]);
      setStats(statsResult.data.getContactInquiryStats as InquiryStats);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId: string, newStatus: string, adminNotes?: string) => {
    try {
      await graphqlClient.graphql({
        query: updateContactInquiryStatus,
        variables: {
          inquiryId,
          status: newStatus,
          adminNotes,
        },
        authMode: 'userPool',
      });

      // Reload data
      await loadData();
      setSelectedInquiry(null);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update inquiry status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Contact Inquiries</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Inquiries List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.inquiryId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {inquiry.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {inquiry.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {inquiry.inquiryType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {inquiry.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <p className="text-gray-900 dark:text-white">{selectedInquiry.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="text-gray-900 dark:text-white">{selectedInquiry.email}</p>
              </div>

              {selectedInquiry.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <p className="text-gray-900 dark:text-white">{selectedInquiry.phone}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <p className="text-gray-900 dark:text-white">{selectedInquiry.inquiryType}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                <p className="text-gray-900 dark:text-white">{selectedInquiry.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  defaultValue={selectedInquiry.status}
                  onChange={(e) => handleStatusUpdate(selectedInquiry.inquiryId, e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {selectedInquiry.adminNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Notes</label>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedInquiry.adminNotes}</p>
                </div>
              )}

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Created: {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(selectedInquiry.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
