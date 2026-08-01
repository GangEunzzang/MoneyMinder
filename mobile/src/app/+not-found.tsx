import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { ErrorState } from '@/shared/ui';

export default function NotFound() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ErrorState
      title="화면을 찾지 못했어요"
      body={'주소가 바뀌었거나 지워진 화면이에요\n홈에서 다시 시작해주세요'}
      actionLabel="홈으로"
      onRetry={() => router.replace('/')}
    />
  );
}
