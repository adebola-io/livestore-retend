import { makePersistedAdapter } from "@livestore/adapter-web";
import { createStorePromise } from "@livestore/livestore";
import { schema } from "@/database/schema";
import { LiveStoreProvider } from "@/database/helpers";
import { Todos } from "./todos";
import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import LiveStoreWorker from "@/database/livestore.worker?worker";
import classes from "./start.styles.module.css";

const Start = () => {
  const initStore = () => {
    return createStorePromise({
      schema,
      storeId: "todomvc-retend",
      adapter: makePersistedAdapter({
        storage: { type: "opfs" },
        worker: LiveStoreWorker,
        sharedWorker: LiveStoreSharedWorker,
      }),
    });
  };

  return (
    <LiveStoreProvider initStore={initStore}>
      {() => (
        <div class={classes.startView}>
          <Todos />
        </div>
      )}
    </LiveStoreProvider>
  );
};

export default Start;
