
# Folder Structure Generator

A command-line tool to generate a standard folder structure and files for Redux Toolkit slices, update `routes.tsx`, and update `store.ts` for Redux integration.

## Installation

To install the package globally, run:

```bash
npm install -g z-structure-file-generator
```

## Prerequisites

Ensure your project directory structure is set up as follows before you start:

```plaintext
.
├── ...
├── src                    
│   ├── pages    
│   └── lib
│       ├── redux    
│       │   └── store.ts      # If this file doesn't exist, the package will create it
│       └── routes
│           └── routes.tsx    # If this file doesn't exist, the package will create it
└── ...
```

The tool will create missing files in `src/lib/redux` and `src/lib/routes` if they aren’t found.

## Usage

To start the folder structure generation process,enure that you are in the `src/pages` then, run the following command in your terminal:

```bash
generate-structure
```

### Step-by-Step Instructions

1. **Enter the file name**: The name of the main file or component you wish to create.
   
2. **Enter the API endpoint**: Specify the API endpoint associated with the file or component.

3. **Enter the route path**: Specify the new route for this page. This will be added to `routes.tsx`.

### Example

1. Run the command:

    ```bash
    generate-structure
    ```

2. When prompted:

    ```plaintext
    Enter the file name: userProfile
    Enter the API endpoint: /api/user/profile
    Enter the new route path: /user/profile
    ```

After completing these steps, the tool will:

- Generate a new folder and file structure based on your input.
- Add the necessary imports and configurations in `store.ts` for Redux Toolkit.
- Update `routes.tsx` to include the new route.

## Getting Started with Development

After the structure generation is complete, you can begin development by adding your specific content to the generated files.
