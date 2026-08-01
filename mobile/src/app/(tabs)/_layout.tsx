import { Tabs } from 'expo-router';

import { useAutoRecord } from '@/features/recurring';
import { TabBar } from '@/shared/ui';

export default function TabsLayout() {
  useAutoRecord();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar state={props.state} navigation={props.navigation} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="mission" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
