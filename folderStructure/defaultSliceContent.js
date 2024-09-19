export const defaultSliceContent = (componentName, apiEndpoint) => `
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const get${componentName}s = createAsyncThunk(
  "${componentName.toLowerCase()}/get${componentName}s",
  async ({ pageSize, currenPage, search }: { pageSize?: number; currenPage?: number; search: string }) => {
    try {
      const response = await axios.get(\`${apiEndpoint}?per_page=\${pageSize}&page=\${currenPage}\`, {
        headers: {
          handle: search,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const get${componentName} = createAsyncThunk(
  "${componentName.toLowerCase()}/get${componentName}",
  async (id: number | string | undefined) => {
    try {
      const response = await axios.get(\`${apiEndpoint}/\${id}\`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const initialState = {
  ${componentName.toLowerCase()}s: [],
  ${componentName.toLowerCase()}: {},
};

const ${componentName}Slice = createSlice({
  name: '${componentName.toLowerCase()}',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get${componentName}s.fulfilled, (state, action) => {
      state.${componentName.toLowerCase()}s = action.payload;
    }).addCase(get${componentName}.fulfilled, (state, action) => {
      state.${componentName.toLowerCase()} = action.payload;
    });
  },
});

export default ${componentName}Slice.reducer;
`;