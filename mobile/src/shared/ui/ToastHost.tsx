import { useToastMessage } from '../lib/toast';
import { Toast } from './Toast';

/** 화면 전환과 무관하게 뜨도록 루트에 한 번만 건다. */
export function ToastHost() {
  const message = useToastMessage();

  return message ? <Toast message={message} /> : null;
}
