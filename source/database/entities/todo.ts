import { Doc, Model } from "@/database/helpers";
import { Events, Schema, State } from "@livestore/livestore";

export const TodoModel = new Model({
  table: State.SQLite.table({
    name: "todos",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      text: State.SQLite.text({ default: "" }),
      completed: State.SQLite.boolean({ default: false }),
      deletedAt: State.SQLite.integer({
        nullable: true,
        schema: Schema.DateFromNumber,
      }),
    },
  }),

  events: {
    created: Events.synced({
      name: "v1.TodoCreated",
      schema: Schema.Struct({ id: Schema.String, text: Schema.String }),
    }),

    completed: Events.synced({
      name: "v1.TodoCompleted",
      schema: Schema.Struct({ id: Schema.String }),
    }),

    uncompleted: Events.synced({
      name: "v1.TodoUncompleted",
      schema: Schema.Struct({ id: Schema.String }),
    }),

    deleted: Events.synced({
      name: "v1.TodoDeleted",
      schema: Schema.Struct({ id: Schema.String, deletedAt: Schema.Date }),
    }),

    clearedCompleted: Events.synced({
      name: "v1.TodoClearedCompleted",
      schema: Schema.Struct({ deletedAt: Schema.Date }),
    }),
  },
});

TodoModel.addMaterializers((table) => {
  return {
    "v1.TodoCreated": ({ id, text }) =>
      table.insert({ id, text, completed: false }),
    "v1.TodoCompleted": ({ id }) =>
      table.update({ completed: true }).where({ id }),
    "v1.TodoUncompleted": ({ id }) =>
      table.update({ completed: false }).where({ id }),
    "v1.TodoDeleted": ({ id, deletedAt }) =>
      table.update({ deletedAt }).where({ id }),
    "v1.TodoClearedCompleted": ({ deletedAt }) =>
      table.update({ deletedAt }).where({ completed: true }),
  };
});

export type Todo = Doc<typeof TodoModel>;
