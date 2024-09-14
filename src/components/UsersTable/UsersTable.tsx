import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/usersSlice';
import { RootState, AppDispatch } from '../../types/index';

const UsersTable: React.FC = () => {
 const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    console.log(users);
    
  }, [users]);  

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

  return (
    <div></div>
    // <table>
    //   <thead>
    //     <tr>
    //       <th>Name</th>
    //       <th>Username</th>
    //       <th>Email</th>
    //       <th>Phone</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {users.map((user) => (
    //       <tr key={user.id}>
    //         <td>{user.name}</td>
    //         <td>{user.username}</td>
    //         <td>{user.email}</td>
    //         <td>{user.phone}</td>
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
  );
};

export default UsersTable;