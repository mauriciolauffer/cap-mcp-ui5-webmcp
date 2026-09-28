sap.ui.define(["sap/ui/model/Filter", "sap/ui/model/FilterOperator"], (Filter, FilterOperator) => {
  const searchAuthors = async (model, input = {}) => {
    if (input.query !== undefined && typeof input.query !== "string") {
      throw new Error("query must be a string");
    }
    const query = typeof input.query === "string" ? input.query.trim() : "";
    const filters = query
      ? [
          new Filter({
            path: "name",
            operator: FilterOperator.Contains,
            value1: query,
          }),
          new Filter({
            path: "placeOfBirth",
            operator: FilterOperator.Contains,
            value1: query,
          }),
          new Filter({
            path: "placeOfDeath",
            operator: FilterOperator.Contains,
            value1: query,
          }),
        ]
      : [];
    const binding = model.bindList("/Authors", null, null, filters, {
      $orderby: "name",
    });

    try {
      const contexts = await binding.requestContexts(0, 20);
      return {
        query,
        count: contexts.length,
        authors: contexts.map((context) => {
          const author = context.getObject();
          return {
            ID: author.ID,
            name: author.name,
            dateOfBirth: author.dateOfBirth,
            dateOfDeath: author.dateOfDeath,
            placeOfBirth: author.placeOfBirth,
            placeOfDeath: author.placeOfDeath,
          };
        }),
      };
    } finally {
      binding.destroy();
    }
  };

  return {
    register(model) {
      const modelContext = document.modelContext;
      if (!modelContext?.registerTool) {
        return null;
      }
      const controller = new AbortController();

      void modelContext
        .registerTool(
          {
            name: "searchAuthors",
            title: "Search Authors",
            description:
              "Searches authors by name or birth/death location. Leave query empty to list authors.",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Text to find in the author name, birth place, or death place.",
                  maxLength: 200,
                },
              },
              required: ["query"],
              additionalProperties: false,
            },
            execute: (input) => searchAuthors(model, input),
            annotations: {
              readOnlyHint: true,
            },
          },
          { signal: controller.signal },
        )
        .catch((error) => {
          if (!controller.signal.aborted) {
            console.warn("WebMCP tool registration failed for searchAuthors", error);
          }
        });

      return controller;
    },
  };
});
