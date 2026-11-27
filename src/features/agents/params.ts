import { parseAsString } from "nuqs/server";

export const agentsParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
