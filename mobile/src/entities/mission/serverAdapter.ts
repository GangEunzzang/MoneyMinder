import type { ActiveMission, MissionId, MissionPeriod } from '@/entities/mission/model';
import type { ServerMission } from '@/shared/lib/api';

const PERIOD_TO_APP: Record<ServerMission['period'], MissionPeriod> = {
  WEEK: 'week',
  MONTH: 'month',
  FOREVER: 'forever',
};

export function toServerPeriod(period: MissionPeriod): ServerMission['period'] {
  return period === 'week' ? 'WEEK' : period === 'month' ? 'MONTH' : 'FOREVER';
}

export function toAppMission(server: ServerMission): ActiveMission {
  return {
    id: server.missionCode as MissionId,
    target: server.target,
    period: PERIOD_TO_APP[server.period],
    startedOn: server.startedOn,
  };
}
