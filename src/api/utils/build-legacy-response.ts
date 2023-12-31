import { FeedSchema, LegacyResponse } from './data-contracts';

interface BuildLegacyResponseArgs {
  status: number;
  description: string;
  data?: FeedSchema[] | FeedSchema;
}

function buildLegacyResponse({
  description,
  data,
  status,
}: BuildLegacyResponseArgs): LegacyResponse {
  return {
    status,
    description,
    data,
  };
}

export default buildLegacyResponse;
