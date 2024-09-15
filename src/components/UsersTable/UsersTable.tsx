import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../features/users/usersSlice";
import { RootState, AppDispatch } from "../../types/index";
import { User } from "../../types/user";

const UsersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    console.log(users);
  }, [users]);


  return (
    <div className="table-container">
      <table className="users-table">
        <thead className="users-table__head">
          <tr className="users-table__head__titles">
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
          <tr className="users-table__head__filters">
            <th>Search</th>
            <th>Search</th>
            <th>Search</th>
            <th>Search</th>
          </tr>
        </thead>
        <tbody className="users-table__body">
          {users.map((user: User) => (
            <tr key={user.id}>
              <td><span>{user.name}</span></td>
              <td><span>{user.username}</span></td>
              <td><span>{user.email}</span></td>
              <td><span>{user.phone} {user.ext && <span className="users-table__body__ext">ext. {user.ext}</span>}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
