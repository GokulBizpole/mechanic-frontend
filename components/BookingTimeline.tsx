'use client';
import { CheckCircle, Circle, Clock, XCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { BookingStatus, BookingStatusLog } from '@/types';
import clsx from 'clsx';

const STEPS: BookingStatus[] = ['pending', 'confirmed', 'assigned', 'completed'];

interface Props {
  currentStatus: BookingStatus;
  logs: BookingStatusLog[];
}

export default function BookingTimeline({ currentStatus, logs }: Props) {
  const { t } = useLanguage();
  const isCancelled = currentStatus === 'cancelled';

  const statusLabels: Record<BookingStatus, string> = {
    pending: t.status.pending,
    confirmed: t.status.confirmed,
    assigned: t.status.assigned,
    completed: t.status.completed,
    cancelled: t.status.cancelled,
  };
  const statusDescs: Record<BookingStatus, string> = {
    pending: t.status.pendingDesc,
    confirmed: t.status.confirmedDesc,
    assigned: t.status.assignedDesc,
    completed: t.status.completedDesc,
    cancelled: t.status.cancelledDesc,
  };

  const stepIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
          <XCircle className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <p className="font-semibold text-red-700">{statusLabels.cancelled}</p>
            <p className="text-sm text-red-500">{statusDescs.cancelled}</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {STEPS.map((step, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            const future = i > stepIndex;
            const log = logs.find(l => l.new_status === step);

            return (
              <div key={step} className="flex gap-4 pb-6 last:pb-0 relative">
                {i < STEPS.length - 1 && (
                  <div className={clsx(
                    'absolute left-4 top-8 w-0.5 h-full -translate-x-1/2',
                    done ? 'bg-green-400' : 'bg-gray-200'
                  )} />
                )}
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10',
                  done ? 'bg-green-500 text-white' : active ? 'bg-accent-500 text-white' : 'bg-gray-200 text-gray-400'
                )}>
                  {done ? <CheckCircle className="w-5 h-5" /> : active ? <Clock className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={clsx(
                    'font-semibold',
                    done || active ? 'text-gray-800' : 'text-gray-400'
                  )}>
                    {statusLabels[step]}
                  </p>
                  <p className={clsx('text-sm', active ? 'text-accent-600' : future ? 'text-gray-400' : 'text-gray-500')}>
                    {statusDescs[step]}
                  </p>
                  {log && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(log.created_at).toLocaleString()}
                      {log.note ? ` • ${log.note}` : ''}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
