import { Tabs } from 'expo-router';

import { MMTabBar } from '@/components/MMTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <MMTabBar state={props.state} navigation={props.navigation} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="mission" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
