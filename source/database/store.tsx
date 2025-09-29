import {
  LiveStoreSchema,
  queryDb,
  type QueryBuilder,
  type Store,
} from "@livestore/livestore";
import { Cell, createScope, If, useScopeContext, useSetupEffect } from "retend";
import { JSX } from "retend/jsx-runtime";

const LiveStoreScope = createScope<Store<any>>();

interface LiveStoreProviderProps<T extends LiveStoreSchema> {
  initStore: () => Promise<Store<T>>;
  children: () => JSX.Template;
  fallback?: () => JSX.Template;
}

/**
 * A provider component that makes a LiveStore instance available to child components
 * via the `LiveStoreScope` context.
 *
 * This component asynchronously initializes the store and renders a fallback
 * component while the store is loading. Once the store is available, it provides
 * it to its children.
 */
export function LiveStoreProvider<T extends LiveStoreSchema>(
  props: LiveStoreProviderProps<T>,
) {
  const { initStore, children, fallback } = props;
  const resource = Cell.async(initStore);

  useSetupEffect(() => {
    resource.run();
  });

  return If(resource.data, {
    false: fallback,
    true: (store) => {
      if (!store) return;
      return (
        <LiveStoreScope.Provider value={store}>
          {children}
        </LiveStoreScope.Provider>
      );
    },
  });
}

/**
 * A hook that subscribes to a live database query and returns the results in a Retend Cell.
 * The Cell updates automatically whenever the underlying query results change.
 *
 * @template TResultSchema The expected schema of the query results before mapping.
 * @template TResult The expected schema of the query results after mapping (defaults to TResultSchema).
 */
export function useLiveQuery<TResultSchema, TResult = TResultSchema>(
  queryInput: QueryBuilder<TResultSchema, any, any>,
  options?: {
    map?: (rows: TResultSchema) => TResult;
  },
): Cell<TResult> {
  const store = useScopeContext(LiveStoreScope);
  const cell = Cell.source<TResult | []>([]);

  useSetupEffect(() => {
    const liveQuery$ = queryDb(queryInput, options);
    return store.subscribe(liveQuery$, {
      onUpdate(value) {
        cell.set(value);
      },
    });
  });

  return cell as Cell<TResult>;
}

/**
 * A hook that provides access to the LiveStore instance from the nearest `LiveStoreScope.Provider`.
 */
export function useStore() {
  return useScopeContext(LiveStoreScope);
}
