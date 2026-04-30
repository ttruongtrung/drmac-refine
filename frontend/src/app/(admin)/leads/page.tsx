'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export default function LeadsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllContacts();
      if (response.data) {
        setContacts(response.data as Contact[]);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkRead = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      await apiClient.updateContact(id, { status: newStatus });
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus as 'unread' | 'read' } : c))
      );
      if (selectedContact?.id === id) {
        setSelectedContact((prev) => prev ? { ...prev, status: newStatus as 'unread' | 'read' } : null);
      }
    } catch {
      alert('Cập nhật trạng thái thất bại.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá yêu cầu này vĩnh viễn?')) return;
    try {
      await apiClient.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    } catch {
      alert('Xoá liên hệ thất bại.');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8 border-l-4 border-blue-600 dark:border-gold pl-3">
        Hộp thư khách hàng
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className={`bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm rounded-xl overflow-hidden ${selectedContact ? 'hidden xl:block' : 'block'} xl:col-span-1`}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-charcoal-light flex items-center justify-between">
            <h2 className="font-semibold text-black dark:text-white">
              Yêu cầu <span className="text-gray-400 text-sm font-normal">({contacts.length})</span>
            </h2>
            <div className="flex gap-1">
              <button
                onClick={fetchContacts}
                className="text-xs text-blue-600 dark:text-gold hover:underline"
              >
                Làm mới
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Đang tải...</div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Chưa có yêu cầu nào. Tin nhắn khách hàng sẽ xuất hiện ở đây.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-charcoal-light max-h-[600px] overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-charcoal/50 ${
                    selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  } ${contact.status === 'unread' ? 'border-l-2 border-blue-600 dark:border-gold' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm truncate ${contact.status === 'unread' ? 'font-bold text-black dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {contact.subject || 'Không có tiêu đề'} — {contact.message.slice(0, 50)}...
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(contact.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(contact.id, contact.status); }}
                        title={contact.status === 'unread' ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'}
                        className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-gold transition-colors"
                      >
                        {contact.status === 'unread' ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                        title="Xoá"
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className={`bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm rounded-xl p-6 ${!selectedContact ? 'hidden xl:flex' : 'block'} xl:col-span-2 flex-col`}>
          {selectedContact ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-white">{selectedContact.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {selectedContact.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} /> {selectedContact.email}
                      </span>
                    )}
                    {selectedContact.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} /> {selectedContact.phone}
                      </span>
                    )}
                    <span>{formatDate(selectedContact.createdAt)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedContact.status === 'unread'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                        : 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400'
                    }`}>
                      {selectedContact.status === 'unread' ? 'Chưa đọc' : 'Đã đọc'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="h-9 text-xs gap-1.5"
                    onClick={() => handleMarkRead(selectedContact.id, selectedContact.status)}
                  >
                    {selectedContact.status === 'unread' ? <Eye size={14} /> : <EyeOff size={14} />}
                    {selectedContact.status === 'unread' ? 'Đã đọc' : 'Chưa đọc'}
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-9 text-xs gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                    onClick={() => handleDelete(selectedContact.id)}
                  >
                    <Trash2 size={14} /> Xoá
                  </Button>
                </div>
              </div>

              {selectedContact.subject && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Chủ đề</p>
                  <p className="text-black dark:text-white font-medium">{selectedContact.subject}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nội dung</p>
                <div className="bg-gray-50 dark:bg-[#111] rounded-xl p-4 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="text-center">
                <Mail size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Chọn một yêu cầu</p>
                <p className="text-sm mt-1">Chọn tin nhắn từ danh sách để xem chi tiết.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
