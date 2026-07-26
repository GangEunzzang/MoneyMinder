import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card } from '@/components/base';
import { useTheme } from '@/hooks/use-theme';
import { addTransaction } from '@/store/ledger';

const CATEGORIES = {
  expense: ['카페·간식', '식비', '교통', '쇼핑', '기타'],
  income: ['급여', '용돈', '이자', '환급', '기타'],
} as const;

export default function AddScreen() {
  const c = useTheme();
  const router = useRouter();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [cat, setCat] = useState('카페·간식');
  const [amount, setAmount] = useState('6100');
  const [merchant, setMerchant] = useState('스타벅스');
  const [dateLabel, setDateLabel] = useState('오늘');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const saved = useRef(false);
  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };
  const selectType = (nextType: 'expense' | 'income') => {
    setType(nextType);
    setCat(CATEGORIES[nextType][0]);
    setMerchant(nextType === 'expense' ? '스타벅스' : '급여');
  };
  const save = async () => {
    if (saved.current) return;
    const parsedAmount = Number(amount);
    if (!Number.isSafeInteger(parsedAmount) || parsedAmount <= 0) {
      setError('1원 이상의 금액을 입력해 주세요.');
      return;
    }

    saved.current = true;
    setSaving(true);
    setError('');
    try {
      await addTransaction({ type, amount: parsedAmount, category: cat, merchant: merchant.trim() || cat, dateLabel: dateLabel.trim() || '오늘' });
      close();
    } catch {
      saved.current = false;
      setSaving(false);
      setError('저장하지 못했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <View style={[styles.fill, { backgroundColor: c.surface }]}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.fill}>
        <View style={styles.topbar}>
          <Pressable onPress={close} hitSlop={10}>
            <Text style={[styles.close, { color: c.inkSoft }]}>✕</Text>
          </Pressable>
          <View style={[styles.seg, { backgroundColor: c.surface2 }]}>
            <Pressable onPress={() => selectType('expense')} style={[styles.segItem, type === 'expense' && { backgroundColor: c.background }]}>
              <Text style={[styles.segText, { color: type === 'expense' ? c.red : c.smoke }]}>지출</Text>
            </Pressable>
            <Pressable onPress={() => selectType('income')} style={[styles.segItem, type === 'income' && { backgroundColor: c.background }]}>
              <Text style={[styles.segText, { color: type === 'income' ? c.mint : c.smoke }]}>수입</Text>
            </Pressable>
          </View>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.amountWrap}>
            <Text style={[styles.eyebrow, { color: c.smoke }]}>얼마를 {type === 'expense' ? '쓰셨' : '받으셨'}나요?</Text>
            <View style={styles.amountRow}>
              <Text style={[styles.amountSign, { color: type === 'income' ? c.mint : c.ink }]}>{type === 'expense' ? '-' : '+'}</Text>
              <TextInput
                value={amount}
                onChangeText={(value) => setAmount(value.replace(/\D/g, ''))}
                keyboardType="number-pad"
                maxLength={12}
                selectTextOnFocus
                style={[styles.amountInput, { color: type === 'income' ? c.mint : c.ink }]}
                accessibilityLabel="금액"
              />
              <Text style={[styles.amountUnit, { color: c.smoke }]}>원</Text>
            </View>
          </View>

          <Text style={[styles.label, { color: c.smoke }]}>카테고리</Text>
          <View style={styles.pills}>
            {CATEGORIES[type].map((name) => {
              const active = cat === name;
              return (
                <Pressable key={name} onPress={() => setCat(name)} style={[styles.pill, { backgroundColor: active ? c.ink : c.surface2 }]}>
                  <Text style={[styles.pillText, { color: active ? '#fff' : c.inkSoft }]}>{name}</Text>
                </Pressable>
              );
            })}
          </View>

          <Card style={{ marginTop: 14, paddingVertical: 2, paddingHorizontal: 14, backgroundColor: c.background }}>
            <View style={[styles.fieldRow, { borderBottomColor: c.hair, borderBottomWidth: 1 }]}>
              <Text style={[styles.fieldLabel, { color: c.inkSoft }]}>결제처</Text>
              <TextInput
                value={merchant}
                onChangeText={setMerchant}
                style={[styles.fieldInput, { color: c.ink }]}
                accessibilityLabel="결제처"
              />
            </View>
            <View style={[styles.fieldRow, { borderBottomColor: c.hair, borderBottomWidth: 1 }]}>
              <Text style={[styles.fieldLabel, { color: c.inkSoft }]}>날짜</Text>
              <TextInput
                value={dateLabel}
                onChangeText={setDateLabel}
                style={[styles.fieldInput, { color: c.ink }]}
                accessibilityLabel="날짜"
              />
            </View>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: c.inkSoft }]}>메모</Text>
              <Text style={[styles.fieldInput, { color: c.mist }]}>입력</Text>
            </View>
          </Card>
          {error ? <Text style={[styles.error, { color: c.red }]}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.footer}>
          <Button label={saving ? '저장 중...' : '저장하기'} onPress={save} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  close: { fontSize: 20, fontWeight: '600' },
  seg: { flexDirection: 'row', borderRadius: 10, padding: 3, gap: 2, width: 132 },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 8 },
  segText: { fontSize: 12, fontWeight: '700' },
  scroll: { paddingHorizontal: 15, paddingBottom: 20 },
  amountWrap: { alignItems: 'center', paddingVertical: 18 },
  eyebrow: { fontSize: 11, fontWeight: '700' },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  amountSign: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  amountInput: { minWidth: 40, maxWidth: 220, fontSize: 32, fontWeight: '800', letterSpacing: -1, fontVariant: ['tabular-nums'], padding: 0 },
  amountUnit: { fontSize: 18, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pill: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 99 },
  pillText: { fontSize: 12, fontWeight: '600' },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600' },
  fieldInput: { minWidth: 120, padding: 0, fontSize: 13, fontWeight: '600', textAlign: 'right' },
  error: { marginTop: 10, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  footer: { paddingHorizontal: 15, paddingBottom: 14, paddingTop: 8 },
});
