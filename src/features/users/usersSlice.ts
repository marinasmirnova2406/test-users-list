import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types/user";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Types ---------------------

interface UsersState {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  filters: {
    name: string;
    username: string;
    email: string;
    phone: string;
  };
}

// ---------------------------

const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");

      const usersArray = JSON.parse(JSON.stringify(res.data));

      usersArray.forEach((user: User) => {
        const parsedUserPhone = parsePhoneNumberFromString(user.phone, "US");

        if (parsedUserPhone) {
          user.phone = parsedUserPhone.number;
          console.log(user.phone);

          parsedUserPhone.ext
            ? (user.ext = parsedUserPhone.ext)
            : (user.ext = null);
        }

        user.email = user.email.toLowerCase();
      });

      return usersArray as User[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string);
      }
      return rejectWithValue("Error fetching users");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    filteredUsers: [],
    loading: false,
    error: null,
    filters: {
      name: '',
      username: '',
      email: '',
      phone: '',
    },
  } as UsersState,
  reducers: {

    setFilter: (state, action: PayloadAction<{ filterName: keyof UsersState['filters']; value: string }>) => {

      const { filterName, value } = action.payload;

      state.filters[filterName] = value;

      if (Object.values(state.filters).every(value => value === '')) {
        state.filteredUsers = state.users;
      } else {
        state.filteredUsers = state.users.filter(user =>
          user.name.toLowerCase().includes(state.filters.name.toLowerCase()) &&
          user.username.toLowerCase().includes(state.filters.username.toLowerCase()) &&
          user.email.toLowerCase().includes(state.filters.email.toLowerCase()) &&
          user.phone.toLowerCase().includes(state.filters.phone.toLowerCase())
        );
      }

      
    },



  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredUsers = action.payload;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error fetching users";
      });
  },
});

export const { setFilter } = usersSlice.actions;
export default usersSlice.reducer;
export { fetchUsers };
