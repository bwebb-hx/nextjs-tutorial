import { Datastore, Item } from "@hexabase/hexabase-js";
import { DATASTORE_ID, getHexabaseClient, PROJECT_ID, WORKSPACE_ID } from "./hexabase";

let todoDatastore: Datastore | null = null;

export async function getTodoDatastore(token: string) : Promise<Datastore | null> {
    if (todoDatastore) return todoDatastore;

    const hxClient = await getHexabaseClient(token);
    if (!hxClient) {
        console.error("failed to get hexabase client");
        return null;
    }
    if (!WORKSPACE_ID || !PROJECT_ID || !DATASTORE_ID) {
        console.error("internal server error: failed to load environment variables");
        return null;
    }

    const workspace = await hxClient.workspace(WORKSPACE_ID);
    if (!workspace) {
        console.error("failed to get hexabase workspace");
        return null;
    }
    const project = await workspace.project(PROJECT_ID);
    if (!project) {
        console.error("failed to get hexabase project");
        return null;
    }
    const datastore = await project.datastore(DATASTORE_ID);
    if (!datastore) {
        console.error("failed to get hexabase datastore");
        return null;
    }
    return datastore;
}

export async function loadTodosFromDatabase(token: string) {
    const datastore = await getTodoDatastore(token);
    if (!datastore) {
        console.error("failed to get hexabase datastore");
        return undefined;
    }
    return datastore.items();
}

export type TodoFields = {
    Title: string
    DueDate: Date
}

export async function createNewTodo(token: string, fields: TodoFields) : Promise<Item[] | undefined> {
    const datastore = await getTodoDatastore(token);
    if (!datastore) {
        console.error("failed to get hexabase datastore");
        return undefined;
    }
    const newItem = await datastore.item();

    // iterate over all the fields in TodoFields, adding each one
    for (const key in fields) {
        newItem.set(key, fields[key as keyof TodoFields]);
    }
    // save and return the whole, updated list of todos
    await newItem.save();
    return datastore.items();
}