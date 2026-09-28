sap.ui.define(
  ["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/Sorter", "./model/cart"],
  (Filter, FilterOperator, Sorter, cart) => {
    const findProducts = async (model, input = {}) => {
      if (input.query !== undefined && typeof input.query !== "string") {
        throw new Error("query must be a string");
      }
      if (input.category !== undefined && typeof input.category !== "string") {
        throw new Error("category must be a string");
      }
      const filters = [];
      const query = input.query?.trim() ?? "";
      const category = input.category?.trim() ?? "";
      if (query) {
        filters.push(
          new Filter({
            path: "Name",
            operator: FilterOperator.Contains,
            value1: query,
          }),
        );
      }
      if (category) {
        filters.push(
          new Filter({
            path: "Category",
            operator: FilterOperator.EQ,
            value1: category,
          }),
        );
      }

      await model.metadataLoaded();
      return new Promise((resolve, reject) => {
        model.read("/Products", {
          filters,
          sorters: [new Sorter("Name")],
          success(oData) {
            const products = oData.results.map((p) => ({
              ProductId: p.ProductId,
              Name: p.Name,
              Category: p.Category,
              ShortDescription: p.ShortDescription,
              SupplierName: p.SupplierName,
              Price: p.Price,
              CurrencyCode: p.CurrencyCode,
              Status: p.Status,
            }));
            resolve({
              query,
              category,
              count: products.length,
              products,
            });
          },
          error(oError) {
            reject(new Error(oError.message || "Failed to read Products"));
          },
        });
      });
    };

    const addProductToCart = async (oDataModel, oCartModel, oBundleFn, input) => {
      const productId = input.productId;
      if (typeof productId !== "string" || !productId.trim()) {
        throw new Error("productId must be a non-empty string");
      }
      const sPath = `/Products('${productId.trim()}')`;

      await oDataModel.metadataLoaded();
      let oProduct = oDataModel.getProperty(sPath);
      if (!oProduct) {
        const binding = oDataModel.bindContext(sPath);
        await binding.requestObject();
        binding.destroy();
        oProduct = oDataModel.getProperty(sPath);
        if (!oProduct) {
          throw new Error(`Product '${productId}' not found`);
        }
      }

      await cart.addToCart(oBundleFn(), oProduct, oCartModel);
      const cartEntries = oCartModel.getProperty("/cartEntries") || {};
      const entry = cartEntries[productId.trim()];
      return {
        productId: productId.trim(),
        name: entry?.Name ?? "",
        quantity: entry?.Quantity ?? 1,
        addedToCart: true,
      };
    };

    return {
      register(oDataModel, oCartModel, oBundleFn) {
        const controller = new AbortController();
        const modelContext = document.modelContext;
        if (!modelContext?.registerTool) {
          return null;
        }
        void modelContext
          .registerTool(
            {
              name: "addProductToCart",
              description:
                "Adds a product to the shopping cart by product ID. Behaves the same as pressing the 'Add to Cart' button on the product page.",
              inputSchema: {
                type: "object",
                properties: {
                  productId: {
                    type: "string",
                    description: "The ID of the product to add to the cart (e.g. 'HT-1000').",
                    maxLength: 10,
                  },
                },
                required: ["productId"],
                additionalProperties: false,
              },
              execute: (input) => addProductToCart(oDataModel, oCartModel, oBundleFn, input),
              annotations: {
                readOnlyHint: false,
              },
            },
            { signal: controller.signal },
          )
          .catch((error) => {
            if (!controller.signal.aborted) {
              console.warn("WebMCP tool registration failed for addProductToCart", error);
            }
          });

        void modelContext
          .registerTool(
            {
              name: "findProducts",
              description:
                "Searches products by name and/or category. Leave query and category empty to list all products.",
              inputSchema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Text to find in the product name.",
                    maxLength: 200,
                  },
                  category: {
                    type: "string",
                    description:
                      "Filter by exact product category (e.g. 'Laptops', 'Accessories').",
                    maxLength: 40,
                  },
                },
                additionalProperties: false,
              },
              execute: (input) => findProducts(oDataModel, input),
              annotations: {
                readOnlyHint: true,
              },
            },
            { signal: controller.signal },
          )
          .catch((error) => {
            if (!controller.signal.aborted) {
              console.warn("WebMCP tool registration failed for findProducts", error);
            }
          });

        return controller;
      },
    };
  },
);
