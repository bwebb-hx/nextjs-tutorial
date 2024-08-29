import { test, describe, expect } from 'vitest';
import { createNewTodo, deleteTodo, loadTodosFromDatabase } from './todo-db';

const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TOKEN!;
if (!PUBLIC_TOKEN) {
    throw new Error('failed to get hx public token; check your environment variables.');
}

describe('example test case', () => {
    test('1 + 1 = 2', () => {
        expect((1 + 1)).toBe(2);
    });
});

describe('creating and deleting todos', () => {
    let itemID = "";
    test('create todo item', async () => {
        const beforeItems = await loadTodosFromDatabase(PUBLIC_TOKEN);
        if (!beforeItems) {
            throw new Error('failed to load todos');
        }
        const afterItems = await createNewTodo(PUBLIC_TOKEN, { Title: "test-todo", DueDate: new Date().toISOString() });
        if (!afterItems) {
            throw new Error('failed to create new todo');
        }
        expect(afterItems.length).toBe(beforeItems.length + 1);
        const createdItem = afterItems.find((item) => (item.fields["Title"] == "test-todo"));
        if (!createdItem) {
            throw new Error('failed to find new todo in afterItems');
        }
        itemID = createdItem.id;
    });
    test('delete todo item', async () => {
        if (itemID == "") {
            return;
        }
        const beforeItems = await loadTodosFromDatabase(PUBLIC_TOKEN);
        if (!beforeItems) {
            throw new Error('failed to load todos');
        }
        const afterItems = await deleteTodo(PUBLIC_TOKEN, itemID);
        if (!afterItems) {
            throw new Error('failed to delete item');
        }
        expect(afterItems.length).toBe(beforeItems.length - 1);
        if (afterItems.find((item) => item.id == itemID)) {
            throw new Error('found item that was supposed to be deleted');
        }
    });
});