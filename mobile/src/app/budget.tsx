import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { expenseCategories } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { filterMonth, monthKey, sumByCategory } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { percent, won, wonUnit } from '@/shared/lib/format';
import { radius, screenPadding, shadow, space, useColors } from '@/shared/theme';
import {
  AmountText,
  Button,
  Card,
  CategoryIcon,
  Keypad,
  NumText,
  ProgressBar,
  Row,
  ScreenHeader,
  SectionHeader,
  Stack,
  Text,
} from '@/shared/ui';

export default function BudgetScreen() {
  const c = useColors();
  const categories = useCategories();
  const budget = useLedger((s) => s.budget);
  const categoryBudgets = useLedger((s) => s.categoryBudgets);
  const setCategoryBudget = useLedger((s) => s.setCategoryBudget);
  const transactions = useLedger((s) => s.transactions);

  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const spend = useMemo(
    () => sumByCategory(filterMonth(transactions, monthKey(new Date()))),
    [transactions],
  );

  const rows = expenseCategories(categories);
  const allocated = rows.reduce((sum, cat) => sum + (categoryBudgets[cat.id] ?? 0), 0);
  const left = budget - allocated;
  const editingCat = editing ? rows.find((cat) => cat.id === editing) : null;

  const open = (id: string) => {
    setEditing(id);
    setDraft(String(categoryBudgets[id] ?? ''));
  };

  const commit = () => {
    if (editing) setCategoryBudget(editing, Number(draft) || 0);
    setEditing(null);
  };

  return (
    <>
      <ScreenHeader title="예산 설정" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, shadow.raised, { backgroundColor: c.violet }]}>
          <Stack gap="sm">
            <Text variant="captionSoft" color="onColorHigh">
              이번 달 총 예산
            </Text>
            <Row between style={styles.heroRow}>
              <AmountText value={won(budget)} color="onColor" />
              <Pressable onPress={() => router.push('/budget-setup')} hitSlop={10}>
                <Text variant="calloutBold" color="onColor">
                  변경
                </Text>
              </Pressable>
            </Row>
          </Stack>
        </View>

        <SectionHeader
          title="카테고리별 예산"
          meta={left >= 0 ? `${wonUnit(left)} 남음` : `${wonUnit(left)} 초과`}
          accent={left >= 0}
        />

        <Card list>
          {rows.map((cat, i) => {
            const limit = categoryBudgets[cat.id] ?? 0;
            const used = spend.get(cat.id) ?? 0;
            const over = limit > 0 && used > limit;

            return (
              <Pressable
                key={cat.id}
                onPress={() => open(cat.id)}
                style={({ pressed }) => (pressed ? styles.pressed : undefined)}
              >
                <Row gap="xl" py="xl" divider={i > 0}>
                  <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />
                  <Stack gap="sm" style={styles.mid}>
                    <Row between center>
                      <Text variant="body">{cat.label}</Text>
                      <NumText variant="bodyBold" color={limit > 0 ? 'ink' : 'mist'}>
                        {limit > 0 ? won(limit) : '미설정'}
                      </NumText>
                    </Row>
                    {limit > 0 ? (
                      <>
                        <ProgressBar
                          value={used / limit}
                          height={6}
                          color={over ? 'red' : cat.tint}
                        />
                        <Text variant="micro" color={over ? 'red' : 'mist'}>
                          {won(used)}원 · {percent(used, limit)}%
                        </Text>
                      </>
                    ) : null}
                  </Stack>
                </Row>
              </Pressable>
            );
          })}
        </Card>
      </ScrollView>

      <Modal visible={editing != null} transparent animationType="fade" onRequestClose={commit}>
        <Pressable style={[styles.scrim, { backgroundColor: c.scrim }]} onPress={commit}>
          <Pressable style={[styles.sheet, { backgroundColor: c.surface }]} onPress={() => {}}>
            <Stack gap="sm" center style={styles.sheetHead}>
              <Text variant="callout" color="smoke">
                {editingCat?.label} 한 달 예산
              </Text>
              <AmountText
                value={Number(draft) > 0 ? won(Number(draft)) : '0'}
                size="display"
                color={Number(draft) > 0 ? 'ink' : 'mist'}
              />
            </Stack>
            <Keypad value={draft} onChange={setDraft} />
            <Button label="확인" onPress={commit} style={styles.sheetCta} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  hero: { marginTop: space.xl, padding: space['4xl'], borderRadius: radius['3xl'] },
  heroRow: { alignItems: 'flex-end' },
  mid: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
  scrim: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    paddingHorizontal: space['4xl'],
    paddingBottom: space['6xl'],
    borderTopLeftRadius: radius['4xl'],
    borderTopRightRadius: radius['4xl'],
  },
  sheetHead: { paddingTop: space['5xl'] },
  sheetCta: { marginTop: space.xl },
});
