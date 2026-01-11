# GraphQL Schema Scripts

This directory contains scripts to help manage GraphQL schema generation and cleanup.

## Available Scripts

### `npm run schema:clean`
Cleans up the GraphQL schema and operations files by removing placeholder fields and operations:
- Removes `_: Boolean` placeholder fields from Query, Mutation, and Subscription types in `schema.graphql`
- Removes placeholder `_` operations from GraphQL files in `src/graphql/`

### `npm run schema:generate`
Runs the complete schema generation process:
1. Cleans the schema and operations files
2. Generates TypeScript types using Amplify CLI

### `npm run schema:download`
Downloads the latest schema from AWS AppSync (requires AWS CLI authentication)

### `npm run schema:update`
Complete workflow to update everything:
1. Downloads the latest schema from AppSync
2. Cleans the schema and operations
3. Generates new TypeScript types

## Usage Examples

```bash
# Just generate types from existing schema
npm run schema:generate

# Download latest schema and generate types
npm run schema:update

# Only clean up placeholder fields/operations
npm run schema:clean
```

## Files Modified

- `schema.graphql` - Main GraphQL schema file
- `src/graphql/queries.ts` - GraphQL query operations
- `src/graphql/mutations.ts` - GraphQL mutation operations  
- `src/graphql/subscriptions.ts` - GraphQL subscription operations
- `src/API.ts` - Generated TypeScript types (auto-generated)

## Troubleshooting

If you encounter validation errors:
1. Run `npm run schema:clean` to remove any placeholder operations
2. Check that your schema doesn't have duplicate field names
3. Ensure AWS CLI is configured if using `schema:download`