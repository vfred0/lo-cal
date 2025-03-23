export interface Technician {
  id: string;
  name: string;
}

export interface Event {
  id: IDBValidKey;
  completed?: boolean;
  summary: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  url?: string;
  technicianId?: string;
};

export type EventCreateInput = Omit<Event, "id">;