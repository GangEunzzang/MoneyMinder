import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { sumExpense, type Transaction } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { dateFull, signedWon, won } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Card,
  CategoryIcon,
  EmptyState,
  FieldInput,
  IconSearch,
  NumText,
  Row,
  Stack,
  Text,
} from '@/shared/ui';

/** 결제처·메모·카테고리 이름을 한꺼번에 훑는다. 어디에 적었는지 기억나지 않아도 찾아진다. */
function matches(t: Transaction, categoryLabel: string, q: string): boolean {
  const hay = `${t.merchant} ${t.memo} ${categoryLabel}`.toLowerCase();

  return hay.includes(q);
}

export default function HistorySearch() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const categories = useCategories();
  const methods = usePaymentMethods((s) => s.methods);
  const transactions = useLedger((s) => s.transactions);
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (trimmed.length === 0) return [];

    return transactions.filter((t) =>
      matches(t, findCategory(categories, t.categoryId).label, trimmed),
    );
  }, [transactions, categories, trimmed]);

  const methodName = useMemo(() => new Map(methods.map((m) => [m.id, m.name])), [methods]);

  return (
    <View style={styles.screen}>
      <Row gap="xl" center style={[styles.bar, { paddingTop: insets.top + space.md }]}>
        <Row gap="md" center style={[styles.field, { backgroundColor: c.surface2 }]}>
          <IconSearch size={17} color={c.smoke} />
          <FieldInput
            value={query}
            onChangeText={setQuery}
            placeholder="결제처 · 메모 · 카테고리"
            accessibilityLabel="검색어"
            autoFocus
            style={styles.input}
          />
        </Row>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text variant="body" color="smoke">
            취소
          </Text>
        </Pressable>
      </Row>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {trimmed.length === 0 ? (
          <EmptyState
            inline
            icon={<IconSearch size={30} color={c.mist} />}
            title="무엇을 찾고 계신가요?"
            body={'가게 이름이나 메모 한 조각만 있어도\n찾아드려요'}
          />
        ) : results.length === 0 ? (
          <EmptyState
            inline
            icon={<IconSearch size={30} color={c.mist} />}
            title="검색 결과가 없어요"
            body="다른 검색어로 다시 시도해보세요"
          />
        ) : (
          <Stack gap="xl">
            <Text variant="caption" color="smoke">
              검색 결과 {results.length}건 · 총 {won(sumExpense(results))}원
            </Text>
            <Card list>
              {results.map((t, i) => {
                const cat = findCategory(categories, t.categoryId);
                const method = t.paymentMethodId ? methodName.get(t.paymentMethodId) : null;

                return (
                  <Pressable
                    key={t.id}
                    onPress={() => router.push(`/transaction/${t.id}`)}
                    style={({ pressed }) => (pressed ? styles.pressed : undefined)}
                  >
                    <Row gap="xl" py="xl" divider={i > 0}>
                      <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft="surface2" />
                      <Stack gap="xxs" style={styles.mid}>
                        <Text variant="body" numberOfLines={1}>
                          {t.merchant || cat.label}
                        </Text>
                        <Text variant="microSoft" color="smoke" numberOfLines={1}>
                          {[cat.label, dateFull(t.date).replace(/ \S+요일$/, ''), method]
                            .filter(Boolean)
                            .join(' · ')}
                        </Text>
                      </Stack>
                      <NumText variant="subheadBold" color={t.type === 'income' ? 'mint' : 'ink'}>
                        {signedWon(t.type === 'expense' ? -t.amount : t.amount)}
                      </NumText>
                    </Row>
                  </Pressable>
                );
              })}
            </Card>
          </Stack>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  bar: { paddingHorizontal: screenPadding, paddingBottom: space.xl },
  field: {
    flex: 1,
    height: 44,
    paddingHorizontal: space['2xl'],
    borderRadius: radius.lg,
  },
  input: { flex: 1, minWidth: 0, textAlign: 'left' },
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  mid: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
});
