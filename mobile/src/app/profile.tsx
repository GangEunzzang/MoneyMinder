import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useAppState } from '@/entities/app/store';
import { useLedger } from '@/entities/transaction/store';
import { currentStreak } from '@/features/mission';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  Card,
  FieldInput,
  FieldRow,
  ScreenHeader,
  Stack,
  Text,
} from '@/shared/ui';

export default function ProfileEdit() {
  const c = useColors();
  const nickname = useAppState((s) => s.nickname);
  const email = useAppState((s) => s.email);
  const bio = useAppState((s) => s.bio);
  const editProfile = useAppState((s) => s.editProfile);
  const transactions = useLedger((s) => s.transactions);

  const [draftName, setDraftName] = useState(nickname);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftBio, setDraftBio] = useState(bio);

  const streak = currentStreak(transactions, new Date());
  const canSave = draftName.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    editProfile({ nickname: draftName.trim(), email: draftEmail.trim(), bio: draftBio.trim() });
    router.back();
  };

  return (
    <>
      <ScreenHeader title="프로필 편집" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stack gap="xl" center style={styles.head}>
          <View style={[styles.avatar, { backgroundColor: c.violet }]}>
            <Text variant="title1" color="onColor">
              {(draftName.trim() || '?').slice(0, 1)}
            </Text>
          </View>
          <Text variant="micro" color="smoke">
            연속 무지출 {streak}일째
          </Text>
        </Stack>

        <Card list>
          <FieldRow
            label="닉네임"
            input={
              <FieldInput
                value={draftName}
                onChangeText={setDraftName}
                placeholder="은짱"
                accessibilityLabel="닉네임"
              />
            }
          />
          <FieldRow
            label="이메일"
            divider
            input={
              <FieldInput
                value={draftEmail}
                onChangeText={setDraftEmail}
                placeholder="eunzzang@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="이메일"
              />
            }
          />
          <FieldRow
            label="한 줄 소개"
            divider
            input={
              <FieldInput
                value={draftBio}
                onChangeText={setDraftBio}
                placeholder="무지출 챌린저"
                accessibilityLabel="한 줄 소개"
              />
            }
          />
        </Card>

        <Text variant="captionMutedLead" color="smoke" style={styles.note}>
          아직 로그인이 붙지 않아 프로필은 이 기기에만 저장돼요.
        </Text>

        <Stack style={styles.actions}>
          <Button label="저장하기" muted={!canSave} onPress={save} />
        </Stack>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  head: { paddingVertical: space['5xl'] },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: radius['5xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: { paddingTop: space['3xl'] },
  actions: { paddingTop: space['6xl'] },
});
