'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ChevronRight, ChevronLeft, Wind, Box, Waves, Tv } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { getServices, createBooking } from '@/lib/api';
import type { Service } from '@/types';
import clsx from 'clsx';

const SERVICE_ICONS: Record<string, React.ElementType> = { wind: Wind, box: Box, waves: Waves, tv: Tv };

function BookingForm() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');

  const [form, setForm] = useState({
    service_id: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    appliance_brand: '',
    issue_description: '',
    preferred_date: '',
    preferred_time_slot: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getServices().then((d: unknown) => {
      const list = d as Service[];
      setServices(list);
      const preselect = searchParams.get('service');
      if (preselect) setForm(f => ({ ...f, service_id: preselect }));
    });
  }, [searchParams]);

  const tomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1 && !form.service_id) e.service_id = 'Please select a service';
    if (step === 2) {
      if (!form.customer_name.trim()) e.customer_name = 'Name is required';
      if (!form.customer_phone.trim() || !/^\d{10}$/.test(form.customer_phone)) e.customer_phone = 'Enter valid 10-digit number';
      if (!form.customer_address.trim()) e.customer_address = 'Address is required';
    }
    if (step === 3) {
      if (!form.preferred_date) e.preferred_date = 'Please select a date';
      if (!form.preferred_time_slot) e.preferred_time_slot = 'Please select a time slot';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await createBooking({ ...form, service_id: parseInt(form.service_id) }) as { booking_number: string };
      setBookingNumber(res.booking_number);
      setStep(5);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === parseInt(form.service_id));
  const steps = [t.booking.step1, t.booking.step2, t.booking.step3, t.booking.step4];

  if (step === 5) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.booking.successTitle}</h2>
        <p className="text-gray-500 mb-4">{t.booking.successMsg}</p>
        <div className="inline-block bg-primary-50 border-2 border-primary-200 rounded-xl px-8 py-4 mb-4">
          <span className="text-3xl font-extrabold text-primary-800">{bookingNumber}</span>
        </div>
        <p className="text-gray-400 text-sm mb-8">{t.booking.successSub}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => router.push(`/booking/status?q=${bookingNumber}`)}
            className="btn-primary"
          >
            {t.booking.trackNow}
          </button>
          <button
            onClick={() => { setStep(1); setForm({ service_id: '', customer_name: '', customer_phone: '', customer_address: '', appliance_brand: '', issue_description: '', preferred_date: '', preferred_time_slot: '' }); }}
            className="btn-outline"
          >
            {t.booking.bookAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={clsx(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary-800 text-white' : 'bg-gray-200 text-gray-500'
              )}>
                {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={clsx('text-xs mt-1 hidden sm:block', step === i + 1 ? 'text-primary-800 font-semibold' : 'text-gray-400')}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={clsx('flex-1 h-0.5 mx-2', step > i + 1 ? 'bg-green-400' : 'bg-gray-200')} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 - Service */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t.booking.selectService}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map(s => {
              const Icon = SERVICE_ICONS[s.icon] || Wind;
              const selected = form.service_id === String(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => set('service_id', String(s.id))}
                  className={clsx(
                    'flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all',
                    selected ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300 bg-white'
                  )}
                >
                  <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', selected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600')}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{lang === 'ta' ? s.name_ta : s.name_en}</p>
                    <p className="text-sm text-gray-400">₹{s.price_from} – ₹{s.price_to}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.service_id && <p className="text-red-500 text-sm mt-2">{errors.service_id}</p>}
        </div>
      )}

      {/* Step 2 - Customer Details */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t.booking.step2}</h2>
          {[
            { key: 'customer_name', label: t.booking.customerName, type: 'text', required: true },
            { key: 'customer_phone', label: t.booking.customerPhone, type: 'tel', required: true },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
              <input type={type} value={(form as Record<string, string>)[key]} onChange={e => set(key, e.target.value)} className="input-field" />
              {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.customerAddress} *</label>
            <textarea rows={3} value={form.customer_address} onChange={e => set('customer_address', e.target.value)} className="input-field resize-none" />
            {errors.customer_address && <p className="text-red-500 text-xs mt-1">{errors.customer_address}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.applianceBrand}</label>
            <input type="text" value={form.appliance_brand} onChange={e => set('appliance_brand', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.issueDescription}</label>
            <textarea rows={3} value={form.issue_description} onChange={e => set('issue_description', e.target.value)} className="input-field resize-none" />
          </div>
        </div>
      )}

      {/* Step 3 - Schedule */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t.booking.step3}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.preferredDate} *</label>
            <input type="date" min={tomorrow()} value={form.preferred_date} onChange={e => set('preferred_date', e.target.value)} className="input-field" />
            {errors.preferred_date && <p className="text-red-500 text-xs mt-1">{errors.preferred_date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t.booking.preferredTime} *</label>
            <div className="grid grid-cols-2 gap-3">
              {t.booking.timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => set('preferred_time_slot', slot)}
                  className={clsx(
                    'py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all',
                    form.preferred_time_slot === slot ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-200 hover:border-primary-300 text-gray-700'
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.preferred_time_slot && <p className="text-red-500 text-xs mt-1">{errors.preferred_time_slot}</p>}
          </div>
        </div>
      )}

      {/* Step 4 - Confirm */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t.booking.review}</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-sm">
            {[
              { label: lang === 'ta' ? 'சேவை' : 'Service', value: selectedService ? (lang === 'ta' ? selectedService.name_ta : selectedService.name_en) : '' },
              { label: lang === 'ta' ? 'பெயர்' : 'Name', value: form.customer_name },
              { label: lang === 'ta' ? 'தொலைபேசி' : 'Phone', value: form.customer_phone },
              { label: lang === 'ta' ? 'முகவரி' : 'Address', value: form.customer_address },
              { label: lang === 'ta' ? 'பிராண்ட்' : 'Brand', value: form.appliance_brand || '—' },
              { label: lang === 'ta' ? 'தேதி' : 'Date', value: form.preferred_date },
              { label: lang === 'ta' ? 'நேரம்' : 'Time', value: form.preferred_time_slot },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                <span className="font-medium text-gray-500">{label}</span>
                <span className="text-gray-800 text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        {step > 1 ? (
          <button onClick={back} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium">
            <ChevronLeft className="w-5 h-5" />
            {t.booking.back}
          </button>
        ) : <div />}
        {step < 4 ? (
          <button onClick={next} className="btn-primary">
            {t.booking.next}
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={submit} disabled={loading} className="btn-primary">
            {loading ? t.common.loading : t.booking.confirm}
            {!loading && <CheckCircle className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary-800">{t.booking.title}</h1>
          <p className="text-gray-500 mt-2">{t.booking.subtitle}</p>
        </div>
        <div className="card p-8">
          <Suspense fallback={<div className="text-center py-8">{t.common.loading}</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
