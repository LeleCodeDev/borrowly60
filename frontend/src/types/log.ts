import type { User } from "./user";

export interface Log {
  id: number;
  user: User | null;
  activity: string;
  createdAt: string;
}
