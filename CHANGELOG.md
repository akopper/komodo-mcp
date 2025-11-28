# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added

- Initial release of Komodo MCP Server
- 35 tools for interacting with Komodo API:
  - 15 read tools (list, get, inspect operations)
  - 12 execute tools (deploy, start, stop, prune operations)
  - 8 write tools (create, update, delete operations)
- Support for SSE and stdio transports
- Docker support with multi-stage build
- TypeScript with strict mode
- Zod schema validation for all tool inputs
- Health check endpoint for SSE mode
- Comprehensive documentation
