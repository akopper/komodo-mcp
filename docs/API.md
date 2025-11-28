# API Reference

Complete reference for all 35 MCP tools provided by Komodo MCP Server.

## Table of Contents

- [Read Operations (15 tools)](#read-operations)
- [Execute Operations (12 tools)](#execute-operations)
- [Write Operations (8 tools)](#write-operations)

---

## Read Operations

Non-mutating operations for querying data from Komodo.

### komodo_list_servers

List all Komodo servers with their status and configuration.

**Parameters:** None

**Returns:** Array of server objects with ID, name, address, and status.

---

### komodo_list_stacks

List all Komodo stacks with their current state (running/down).

**Parameters:** None

**Returns:** Array of stack objects with ID, name, server, and state.

---

### komodo_list_deployments

List all Komodo deployments.

**Parameters:** None

**Returns:** Array of deployment objects.

---

### komodo_get_stack

Get detailed information about a specific stack.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID |

**Returns:** Detailed stack object including configuration and status.

---

### komodo_get_stack_log

Get deployment logs for a stack.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID |

**Returns:** Log output from stack deployment operations.

---

### komodo_get_container_log

Get logs from a specific container.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |
| `container` | string | Yes | Container name or ID |
| `tail` | number | No | Number of lines to return (default: 100) |

**Returns:** Container log output.

---

### komodo_list_containers

List all Docker containers on a server.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |

**Returns:** Array of container objects with name, image, state, and status.

---

### komodo_inspect_container

Get detailed information about a container.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |
| `container` | string | Yes | Container name or ID |

**Returns:** Full Docker inspect output for the container.

---

### komodo_get_system_stats

Get system statistics for a server (CPU, memory, disk).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |

**Returns:** System metrics including CPU usage, memory usage, and disk space.

---

### komodo_list_images

List all Docker images on a server.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |

**Returns:** Array of image objects with repository, tag, and size.

---

### komodo_list_networks

List all Docker networks on a server.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |

**Returns:** Array of network objects with name, driver, and scope.

---

### komodo_list_volumes

List all Docker volumes on a server.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |

**Returns:** Array of volume objects with name and driver.

---

### komodo_get_alerts

List all system alerts.

**Parameters:** None

**Returns:** Array of alert objects with severity and message.

---

### komodo_search_logs

Search container logs for specific terms.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |
| `container` | string | Yes | Container name or ID |
| `terms` | string[] | Yes | Search terms to find in logs |

**Returns:** Log lines matching the search terms.

---

### komodo_get_stack_services

Get summary of all stacks with their services and status.

**Parameters:** None

**Returns:** Summary object with all stacks and their service states.

---

## Execute Operations

Runtime operations that affect running containers and stacks.

### komodo_deploy_stack

Deploy or redeploy a stack (pulls images and starts containers).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID to deploy |

**Returns:** Deployment result with status.

---

### komodo_start_stack

Start a stopped stack.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID to start |

**Returns:** Operation result.

---

### komodo_stop_stack

Stop a running stack (keeps containers, just stops them).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID to stop |

**Returns:** Operation result.

---

### komodo_restart_stack

Restart a stack (stop then start).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID to restart |

**Returns:** Operation result.

---

### komodo_destroy_stack

Destroy a stack (stops and removes containers).

> **WARNING:** This is a destructive operation!

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID to destroy |

**Returns:** Operation result.

---

### komodo_pull_stack

Pull latest images for a stack without deploying.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID |

**Returns:** Pull result with image status.

---

### komodo_start_container

Start a specific container.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |
| `container` | string | Yes | Container name or ID to start |

**Returns:** Operation result.

---

### komodo_stop_container

Stop a specific container.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |
| `container` | string | Yes | Container name or ID to stop |

**Returns:** Operation result.

---

### komodo_restart_container

Restart a specific container.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |
| `container` | string | Yes | Container name or ID to restart |

**Returns:** Operation result.

---

### komodo_prune_images

Remove unused Docker images from a server.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |

**Returns:** Prune result with reclaimed space.

---

### komodo_prune_networks

Remove unused Docker networks from a server.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |

**Returns:** Prune result.

---

### komodo_prune_system

Full Docker system prune (images, networks, volumes, build cache).

> **WARNING:** This is a destructive operation!

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `server` | string | Yes | Server name or ID |

**Returns:** Prune result with reclaimed space.

---

## Write Operations

Configuration operations that create, update, or delete resources.

### komodo_create_stack

Create a new stack in Komodo.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Name for the new stack |
| `server_id` | string | Yes | Server ID to deploy the stack on |
| `compose_contents` | string | No | Docker Compose file contents (YAML) |

**Returns:** Created stack object with ID.

---

### komodo_update_stack

Update stack configuration.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Stack ID to update |
| `config` | object | Yes | Configuration object to update |

**Returns:** Updated stack object.

---

### komodo_delete_stack

Delete a stack from Komodo.

> **WARNING:** This permanently removes the stack configuration!

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Stack ID to delete |

**Returns:** Deletion confirmation.

---

### komodo_write_stack_contents

Write or update the Docker Compose file contents for a stack.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `stack` | string | Yes | Stack name or ID |
| `contents` | string | Yes | Docker Compose file contents (YAML) |

**Returns:** Operation result.

---

### komodo_create_server

Add a new server to Komodo.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Name for the new server |
| `address` | string | Yes | Periphery address (e.g., https://periphery:8120) |

**Returns:** Created server object with ID.

---

### komodo_update_server

Update server configuration.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Server ID to update |
| `config` | object | Yes | Configuration object to update |

**Returns:** Updated server object.

---

### komodo_delete_server

Remove a server from Komodo.

> **WARNING:** This removes the server connection!

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Server ID to delete |

**Returns:** Deletion confirmation.

---

### komodo_rename_stack

Rename a stack.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Stack ID to rename |
| `name` | string | Yes | New name for the stack |

**Returns:** Renamed stack object.
