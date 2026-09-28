# cap-mcp-ui5-webmcp

0. Start the project from the root folder...

- $ cds init --nodejs
- $ cd cap-mcp-ui5-webmcp
- $ cds add sqlite, sample
- $ code .
- ADD new test data files
- $ npm i
- $ npm start

1. Ask AI to find book pointing to index (OData)...

- $ cd ../zzzblank
- PROMPT: go to http://localhost:4004 and return the details for book "Dom Casmurro" in JSON format

2. Add MCP...

- $ npm add @cap-js/mcp
- ADD @mcp tag to the service: "annotate CatalogService with @odata @mcp;"
- PROMPT: go to http://localhost:4004 and return the details for book "Dom Casmurro" in JSON format

3. Ask AI to find book pointing to the site...

- PROMPT: go to http://localhost:4004/fiori-apps.html#Books-display and return the details for book "Dom Casmurro" in JSON format

4. Add WebMCP

- ADD srv/server.js file
- ADD WebMCP register to app/browse/webapp/Component.js
- ADD WebMCP module to app/browse/webapp/webmcp.js












5. AI Core get author's quote of the day

- CAP MCP list author's books

- WebMCP list author's books

do you have access to a browser? do you understand webMCP? can you use webMCP features available in a WebMCP-enabled site?

open the browser and navigate to http://localhost:4004/fiori-apps.html#Authors-manage, wait for it to fully be loaded and rendered, search for Edgar Allen Poe and return the author's details

have you used the webmcp tools available in the site? if not, try again and make sure to use it,

- CAP AI get author's quote of the day
