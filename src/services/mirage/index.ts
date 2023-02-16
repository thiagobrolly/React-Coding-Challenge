import { createServer, Factory, Model } from 'miragejs';
import { faker } from '@faker-js/faker';
import { IMessage } from '@/common/types';

export function makeServer() {
  const server = createServer({
    models: {
      message: Model.extend<Partial<IMessage>>({}),
    },

    factories: {
      message: Factory.extend({
        id() {
          return faker.datatype.uuid();
        },
        name() {
          return faker.name.fullName();
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        message() {
          return faker.lorem.paragraph();
        },
        subject() {
          return faker.lorem.word();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },

    seeds(server2) {
      server2.createList('message', 7);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750;

      this.get('/messages', (schema) => {
        return schema.messages.all();
      });

      this.post('/messages', (schema, request) => {
        const data = JSON.parse(request.requestBody);

        return schema.messages.create(data);
      });

      this.delete('/messages/:id', (schema, request) => {
        const { id } = request.params;

        return schema.messages.find(id).destroy();
      });

      this.namespace = '';
      this.passthrough();
    },
  });

  return server;
}
