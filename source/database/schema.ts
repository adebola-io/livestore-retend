import { makeSchema, State } from "@livestore/livestore";
import { TodoModel } from "./entities/todo";

export const schema = makeSchema({
  events: {
    ...TodoModel.events,
  },
  state: State.SQLite.makeState({
    tables: {
      todos: TodoModel.table,
    },
    materializers: {
      ...TodoModel.materializers,
    },
  }),
});
