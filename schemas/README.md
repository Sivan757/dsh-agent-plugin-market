# Vendored Agent Plugins JSON Schemas

These files are pinned copies of the official Agent Plugins 1.0.0 schemas:

- source: https://github.com/agentplugins/agent-plugins-spec (schemas/1.0.0/)
- spec status: version 1.0.0, working draft
- license: the Agent Plugins specification repository's license

They are bundled into the published package because the specification requires clients to validate plugin packages without retrieving schemas at load time (§7.2.1: "Clients MUST NOT retrieve a schema while loading a plugin").

Update procedure: replace both files from the upstream repository at the pinned spec version and bump the spec-version references in `src/validate.ts`.
