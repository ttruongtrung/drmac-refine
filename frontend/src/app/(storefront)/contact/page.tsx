'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    return newErrors;
  };

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const response = await apiClient.createContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject || undefined,
        message: formData.message,
      });

      if (response.error) {
        setApiError(response.error);
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch {
      setApiError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const storeInfo = [
    { icon: MapPin, label: 'Address', value: '119 3/2 Street, TP HCM, Vietnam' },
    { icon: Phone, label: 'Phone', value: '+84 28 1234 5678' },
    { icon: Mail, label: 'Email', value: 'contact@drmac.vn' },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 9:00 PM' },
  ];

  return (
    <div className="pt-28 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Have a question, feedback, or need assistance? We&apos;d love to hear from you.
          Get in touch with the Dr.Mac team.
        </p>
      </div>

      {/* Store Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {storeInfo.map((info) => {
          const Icon = info.icon;
          return (
            <div
              key={info.label}
              className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-black dark:text-gold" />
              </div>
              <h3 className="font-semibold text-black dark:text-white mb-1">{info.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{info.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass-panel rounded-2xl p-8 md:p-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-3">Message Sent!</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                Thank you for reaching out! We&apos;ve received your message and will get back to you within 24 hours.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="primary"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Get in Touch</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              {apiError && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30 p-4 text-sm text-red-800 dark:text-red-200">
                  <AlertCircle size={16} /> {apiError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black dark:text-white mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal border text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                        errors.name
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-gray-300 dark:border-charcoal-light focus:ring-black dark:focus:ring-gold'
                      )}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal border text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                        errors.email
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-gray-300 dark:border-charcoal-light focus:ring-black dark:focus:ring-gold'
                      )}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-black dark:text-white mb-1.5">
                    Phone Number <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+84 90 123 4567"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal border border-gray-300 dark:border-charcoal-light text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gold transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-black dark:text-white mb-1.5">
                    Subject <span className="text-gray-400 text-xs">(optional)</span>
                  </label>














                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal border border-gray-300 dark:border-charcoal-light text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gold transition-all appearance-none cursor-pointer pr-10"
                    >
                      <option value="">Select a subject...</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="order-support">Order Support</option>
                      <option value="repair-service">Repair & Service</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black dark:text-white mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className={cn(
                      'w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal border text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none',
                      errors.message
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-gray-300 dark:border-charcoal-light focus:ring-black dark:focus:ring-gold'
                    )}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <Button type="submit" variant="primary" className="w-full h-12 text-base gap-2" disabled={submitting}>
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* Google Maps Embed */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl overflow-hidden h-full min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.426501023333!2d106.68504831526155!3d10.778546261925945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3b7c5b6b6b%3A0x8f8f8f8f8f8f8f8f!2zMTE5IMSQLiAzLzIsIFBoxrDhu51uZyBQaMaw4bujbmcgVEhFTSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1!4m1!2s119%203%2F2%20Street%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '450px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dr.Mac Store Location - 119 3/2 Street, TP HCM"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
