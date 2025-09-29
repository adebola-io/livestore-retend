import { Todo, TodoModel } from "@/database/entities/todo";
import { useLiveQuery, useStore } from "@/database/store";
import { For } from "retend";
import classes from "./start.styles.module.css";

export async function Todos() {
  const todos = useLiveQuery(TodoModel.table.where({ deletedAt: null }));
  const store = useStore();

  const handleSubmit = (event: Event) => {
    const target = event.target as HTMLFormElement;
    const data = new FormData(target);
    const text = data.get("taskName") as string;
    const dbEvent = TodoModel.events.created({ id: crypto.randomUUID(), text });
    store.commit(dbEvent);
    target.reset();
  };

  const handleToggle = (todo: Todo) => {
    const { id } = todo;
    const dbEvent = todo.completed
      ? TodoModel.events.uncompleted({ id })
      : TodoModel.events.completed({ id });
    store.commit(dbEvent);
  };

  const handleDelete = (todo: Todo) => {
    const dbEvent = TodoModel.events.deleted({
      id: todo.id,
      deletedAt: new Date(),
    });
    store.commit(dbEvent);
  };

  const handleClearCompleted = () => {
    const dbEvent = TodoModel.events.clearedCompleted({
      deletedAt: new Date(),
    });
    store.commit(dbEvent);
  };

  return (
    <div class={classes.content}>
      <h1 class={classes.heading}>Todos</h1>
      <form onSubmit--prevent={handleSubmit}>
        <input
          name="taskName"
          type="text"
          placeholder="What needs to be done?"
          class={classes.button}
          required
        />
        <button type="submit" class={classes.button}>
          Add Todo
        </button>
      </form>
      <button
        type="button"
        class={classes.button}
        onClick={handleClearCompleted}
      >
        Clear Completed
      </button>
      <ul class={classes.todoList}>
        {For(todos, (todo) => (
          <TodoItem
            item={todo}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </ul>
    </div>
  );
}

interface TodoItemProps {
  item: Todo;
  onToggle: (item: Todo) => void;
  onDelete: (item: Todo) => void;
}

function TodoItem(props: TodoItemProps) {
  const { item, onToggle: handleToggle, onDelete: handleDelete } = props;

  return (
    <li class={classes.todoItem}>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={() => handleToggle(item)}
      />
      <span
        class={classes.todoText}
        style={item.completed ? { textDecoration: "line-through" } : {}}
      >
        {item.text}
      </span>
      <button
        type="button"
        class={classes.button}
        onClick={() => handleDelete(item)}
      >
        Delete
      </button>
    </li>
  );
}
