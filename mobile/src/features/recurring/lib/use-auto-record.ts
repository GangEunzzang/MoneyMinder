import { useEffect } from 'react';

import { useRecurring } from '@/entities/recurring/store';
import { useLedger } from '@/entities/transaction/store';

import { pendingAutoRecords } from '../model/auto-record';

/**
 * 앱이 뜰 때 한 번, 밀린 고정지출을 내역에 반영한다.
 * 멱등성은 lastRecordedMonth가 보장하므로 여러 번 호출돼도 중복되지 않는다.
 */
export function useAutoRecord() {
  useEffect(() => {
    const { items, markRecorded } = useRecurring.getState();
    const { add } = useLedger.getState();

    for (const pending of pendingAutoRecords(items, new Date())) {
      add(pending.transaction);
      markRecorded(pending.recurringId, pending.month);
    }
  }, []);
}
