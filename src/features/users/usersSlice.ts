import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types/user";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Types ---------------------

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
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
    loading: false,
    error: null,
  } as UsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error fetching users";
      });
  },
});

export default usersSlice.reducer;
export { fetchUsers };
