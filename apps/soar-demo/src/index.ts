import { createApp } from "@yeseh/soar-core";
import { Adapter as JsonAdapter } from '@yeseh/soar-json'
import path from 'path';

const json = new JsonAdapter(path.join(process.cwd(), 'repository/'));
const app = createApp(json)

app.router({
    name: 'users',
    collection: 'users',
    idField: 'id'
})

app.start();