import { test, describe, expect } from 'vitest';
import { createNewTodo, deleteTodo, editTodo, loadTodosFromDatabase } from './todo-db';

const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TOKEN!;
if (!PUBLIC_TOKEN) {
    throw new Error('failed to get hx public token; check your environment variables.');
}

describe('example test case', () => {
    test('1 + 1 = 2', () => {
        expect((1 + 1)).toBe(2);
    });
});

describe('creating and deleting todos', async () => {
    let itemID = "";
    let curItems = await loadTodosFromDatabase(PUBLIC_TOKEN);
    if (!curItems) {
        throw new Error('failed to load todos');
    }
    const test_str = "%_test_%";

    test('create todo item', async () => {
        const beforeItems = [...curItems!];
        curItems = await createNewTodo(PUBLIC_TOKEN, { Title: test_str + "todo", DueDate: new Date().toISOString() });
        if (!curItems) {
            throw new Error('failed to create new todo');
        }
        expect(curItems.length).toBe(beforeItems.length + 1);
        const createdItem = curItems.find((item) => (item.fields["Title"] == test_str + "todo"));
        if (!createdItem) {
            throw new Error('failed to find new todo in afterItems');
        }
        itemID = createdItem.id;
    });
    test('edit todo item', async () => {
        if (itemID == "") return;

        const beforeItem = curItems?.find((item) => item.id == itemID);
        if (!beforeItem) throw new Error('failed to find item to edit');
        
        curItems = await editTodo(PUBLIC_TOKEN, itemID, {
            Title: test_str + 'edited-todo'
        });
        const editedItem = curItems?.find((item) => item.id == itemID);
        if (!editedItem) throw new Error('failed to find edited item');

        expect(editedItem.fields["Title"]).toBe(test_str + 'edited-todo');
        expect(editedItem.fields["DueDate"]).toStrictEqual(beforeItem.fields["DueDate"]);
    })
    test('delete todo item', async () => {
        if (itemID == "") return;

        const beforeItems = [...curItems!];
        curItems = await deleteTodo(PUBLIC_TOKEN, itemID);
        if (!curItems) {
            throw new Error('failed to delete item');
        }
        expect(curItems.length).toBe(beforeItems.length - 1);
        if (curItems.find((item) => item.id == itemID)) {
            throw new Error('found item that was supposed to be deleted');
        }
    });
    test('confirm cleanup', async () => {
        curItems = await loadTodosFromDatabase(PUBLIC_TOKEN);
        if (curItems?.find((item) => item.title.includes(test_str))) {
            throw new Error('found test todos in database. did cleanup of other test cases fail?');
        }
    });
});