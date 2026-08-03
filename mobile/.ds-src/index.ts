export { Text, NumText, AmountText } from '../src/shared/ui/Text';
export { Button } from '../src/shared/ui/Button';
export { Card, HeroCard, Row, Stack, Divider, SectionHeader } from '../src/shared/ui/layout';
export { Chip, PayChip } from '../src/shared/ui/Chip';
export { ListRow, SettingRow } from '../src/shared/ui/ListRow';
export { DetailRow, FieldRow, AmountField, FieldInput } from '../src/shared/ui/fields';
export { ProgressBar } from '../src/shared/ui/ProgressBar';
export { Toggle, ToggleRow } from '../src/shared/ui/Toggle';
export { Segmented } from '../src/shared/ui/Segmented';
export { MonthPager } from '../src/shared/ui/MonthPager';
export { CategoryIcon } from '../src/shared/ui/CategoryIcon';
export { WeekDots } from '../src/features/mission/ui/WeekDots';
export { TabBar } from '../src/shared/ui/TabBar';
export { ScreenHeader } from '../src/shared/ui/ScreenHeader';
export { Keypad } from '../src/shared/ui/Keypad';
export { ScreenBody, Spring } from '../src/shared/ui/layout';
export { ChipRow } from '../src/shared/ui/Chip';
export { ColorSwatch, IconBadge } from '../src/shared/ui/ListRow';
export { Calendar } from '../src/shared/ui/Calendar';
export { ConfirmDialog } from '../src/shared/ui/ConfirmDialog';
export { EmptyState } from '../src/shared/ui/EmptyState';
export { Toast } from '../src/shared/ui/Toast';
export { ErrorState, Loading, Splash } from '../src/shared/ui/ScreenState';
export { TrendChart } from '../src/features/report/ui/TrendChart';
export { StreakCard } from '../src/features/mission/ui/StreakCard';
export { Badge } from '../src/features/mission/ui/Badge';
export { StackBar } from '../src/features/payment-method/ui/StackBar';
export * from '../src/shared/ui/icons';

// RNW 는 <style id="react-native-stylesheet"> 를 head 에 심는데, 검증기의 마운트
// 셀렉터가 [id^="r"] 라 이게 첫 root 로 잡혀 전 컴포넌트가 "빈 root" 로 오판된다.
if (typeof document !== 'undefined') {
  const rename = () => document.getElementById('react-native-stylesheet')?.setAttribute('id', 'ds-rnw-stylesheet');
  rename();
  setTimeout(rename, 0);
}
