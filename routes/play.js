import { Errors, mapErrorDetails, sanitizeErrorMessage } from '../util';
import { v4 as uuid } from 'uuid';
import { Components } from '../app';
import { Todo, TodoID } from './todo.repository';
import { ClientEvents, Response, ServerEvents } from '../events';
import { Socket } from 'socket.io';

export default function () {
  return {
    createTodo: async function (payload, callback) {
      const socket = this;

      // validate the payload
      const { error, value } = todoSchema.tailor('create').validate(payload, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return callback({
          error: Errors.INVALID_PAYLOAD,
          errorDetails: mapErrorDetails(error.details),
        });
      }

      value.id = uuid();

      // persist the entity
      try {
        // await todoRepository.save(value);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      // acknowledge the creation
      callback({
        data: value.id,
      });

      // notify the other users
      socket.broadcast.emit('todo:created', value);
    },
  };
}
