import { GroupDto } from '../dto';

interface CurrentInstance {
  group: string;
  createdAt: number;
  updatedAt: number;
}

interface GroupsDictionary {
  [key: string]: GroupDto;
}

function groupsSummaryReducer(
  result: GroupsDictionary,
  current: CurrentInstance,
): GroupsDictionary {
  const { group, createdAt, updatedAt } = current;
  const groupInfo = result[group];

  if (!groupInfo) {
    result[group] = {
      group,
      instances: '1',
      createdAt,
      updatedAt,
    };

    return result;
  }

  result[group].instances = String(Number(groupInfo.instances) + 1);
  result[group].createdAt = Math.min(groupInfo.createdAt, createdAt);
  result[group].updatedAt = Math.max(groupInfo.updatedAt, updatedAt);

  return result;
}

export { groupsSummaryReducer };
