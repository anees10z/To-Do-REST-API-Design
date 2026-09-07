// specification for swagger

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "To-Do Task API",
    version: "1.0.0",
    description: "A simple REST API for managing tasks",
  },
  paths: {
    "/tasks": {
      get: {
        summary: "Get all tasks",
        responses: {
          "200": {
            description: "A list of tasks",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      title: { type: "string" },
                      done: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Task created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    done: { type: "boolean" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid task data",
          },
        },
      },
    },

    "/tasks/{id}": {
      get: {
        summary: "Get a task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Task Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    done: { type: "boolean" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Task Not Found",
          },
        },
      },
      put: {
        summary: "Update a task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  done: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Task updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    done: { type: "boolean" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid task data",
          },
          "404": {
            description: "Task Not Found",
          },
        },
      },
      delete: {
        summary: "Delete a task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "204": {
            description: "Task deleted successfully",
          },
          "404": {
            description: "Task Not Found",
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
