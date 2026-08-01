import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { type Category, expenseCategories, incomeCategories } from '@/entities/category/model';
import { useCategories, useCategoryStore } from '@/entities/category/store';
import { filterMonth, monthKey, sumByCategory } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { wonUnit } from '@/shared/lib/format';
import { screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  Card,
  CategoryIcon,
  ConfirmDialog,
  IconChevronRight,
  IconTrash,
  ListRow,
  ScreenHeader,
  SectionHeader,
  Spring,
} from '@/shared/ui';

export default function CategoryManage() {
  const c = useColors();
  const categories = useCategories();
  const remove = useCategoryStore((s) => s.remove);
  const transactions = useLedger((s) => s.transactions);
  const [removing, setRemoving] = useState<Category | null>(null);

  const spend = useMemo(
    () => sumByCategory(filterMonth(transactions, monthKey(new Date()))),
    [transactions],
  );

  const used = removing ? transactions.filter((t) => t.categoryId === removing.id).length : 0;

  const renderRow = (cat: Category, index: number) => (
    <ListRow
      key={cat.id}
      leading={<CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />}
      title={cat.label}
      subtitle={spend.get(cat.id) ? wonUnit(spend.get(cat.id)!) : '이번 달 사용 없음'}
      trailing={<IconChevronRight size={16} color={c.mist} />}
      divider={index > 0}
      onPress={() => router.push(`/categories/${cat.id}`)}
    />
  );

  return (
    <>
      <ScreenHeader title="카테고리 관리" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="지출" meta={`${expenseCategories(categories).length}개`} first />
        <Card list>{expenseCategories(categories).map(renderRow)}</Card>

        <SectionHeader title="수입" meta={`${incomeCategories(categories).length}개`} />
        <Card list>{incomeCategories(categories).map(renderRow)}</Card>

        <Spring />
        <Button
          label="카테고리 추가"
          variant="secondary"
          size="sm"
          style={styles.cta}
          onPress={() => router.push('/categories/new')}
        />
      </ScrollView>

      <ConfirmDialog
        visible={removing != null}
        icon={<IconTrash size={24} color={c.red} />}
        title={`${removing?.label ?? ''}을 지울까요?`}
        message={
          used > 0
            ? `이미 기록한 ${used}건은 그대로 남고,\n분류만 "기타"로 바뀌어요`
            : '이 카테고리로 기록한 내역은 없어요'
        }
        confirmLabel="삭제"
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          if (removing) remove(removing.id);
          setRemoving(null);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  cta: { marginTop: space['4xl'] },
});
