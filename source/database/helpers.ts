import { EventDef, Materializer, State } from "@livestore/livestore";

export class Model<Table, EventMap> {
  table: Table;
  events: EventMap;
  materializers!: Materializers<EventMap>;

  constructor(config: { table: Table; events: EventMap }) {
    this.table = config.table;
    this.events = config.events;
  }

  addMaterializers(cb: (table: Table) => Materializers<EventMap>) {
    this.materializers = cb(this.table);
  }
}

export type Doc<
  T extends Model<Table, any>,
  Table extends State.SQLite.TableDef = T["table"],
> = State.SQLite.FromTable.RowDecoded<Table>;

export type Materializers<EventMap> =
  EventMap extends Record<string, EventDef.Any>
    ? {
        [TEventName in EventMap[keyof EventMap]["name"] as Extract<
          EventMap[keyof EventMap],
          { name: TEventName }
        >["options"]["derived"] extends true
          ? never
          : TEventName]: Materializer<
          Extract<EventMap[keyof EventMap], { name: TEventName }>
        >;
      }
    : never;
