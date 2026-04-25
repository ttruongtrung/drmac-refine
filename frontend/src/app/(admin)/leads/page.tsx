import { Button } from '@/components/ui/button';
import { Mail, Phone, CheckCircle } from 'lucide-react';

export default function LeadsPage() {
  const leads = [
    { id: '1', name: 'John Doe', phone: '+1 555-0100', product: 'MacBook Pro 16" M3 Max', status: 'NEW', date: 'Today, 10:45 AM' },
    { id: '2', name: 'Sarah Smith', phone: '+1 555-0122', product: 'iPad Pro 13" M4', status: 'CONTACTED', date: 'Yesterday, 2:30 PM' },
    { id: '3', name: 'Michael Chen', phone: '+1 555-0199', product: 'MacBook Air 15" M3', status: 'CLOSED', date: 'Oct 22, 2025' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8 border-l-4 border-blue-600 dark:border-gold pl-3">Leads Inbox</h1>

      <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-charcoal border-b border-gray-100 dark:border-charcoal-light">
              <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Customer</th>
              <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Interest</th>
              <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Date</th>
              <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Status</th>
              <th className="p-4 text-right text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-charcoal-light">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-charcoal/50 transition-colors">
                <td className="p-4">
                  <p className="text-black dark:text-white font-medium">{lead.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1"><Phone size={12}/> {lead.phone}</span>
                  </div>
                </td>
                <td className="p-4 text-blue-600 dark:text-gold text-sm font-medium">{lead.product}</td>
                <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{lead.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'NEW' ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50' :
                    lead.status === 'CONTACTED' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900/50' :
                    'bg-green-50 text-green-600 border border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900/50'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" className="h-8 px-3 text-xs border border-gray-200 dark:border-charcoal-light text-black dark:text-white">
                    Update Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
