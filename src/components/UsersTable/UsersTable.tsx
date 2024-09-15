import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, setFilter } from "../../features/users/usersSlice";
import { RootState, AppDispatch } from "../../types/index";
import { User } from "../../types/user";
import { usersTableSchema } from "./usersTableSchema";

const UsersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredUsers, filters } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    console.log(filteredUsers);
  }, [filteredUsers]);

  const handleFilterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      name === "name" ||
      name === "username" ||
      name === "email" ||
      name === "phone"
    ) {
      try {
        if (value) {
          await usersTableSchema.validateAt(name, { [name]: value });
        }
        dispatch(setFilter({ filterName: name, value }));
      } catch (error) {
        console.log("Error in handleFilterChange function");
      }
    }
  };

  const highlightMatches = (columnName: string, userPropValue: string) => {
    if (filters[columnName] === "") {
      return userPropValue;
    }

    const subString = filters[columnName];

    let htmlString = "";
    let startIndex = 0;
    let i = userPropValue
      .toLowerCase()
      .indexOf(subString.toLowerCase(), startIndex);

    console.log(i);

    while (i !== -1) {
      htmlString += userPropValue.substring(startIndex, i);

      htmlString += `<b>${userPropValue.substring(
        i,
        i + subString.length
      )}</b>`;

      startIndex = i + subString.length;

      i = userPropValue
        .toLowerCase()
        .indexOf(subString.toLowerCase(), startIndex);
    }

    htmlString += userPropValue.substring(startIndex);

    console.log(htmlString);

    return htmlString;
  };

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
            <th>
              <input
                className="users-table__head__filters__item"
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Filter by name..."
              />
            </th>
            <th>
              <input
                className="users-table__head__filters__item"
                type="text"
                name="username"
                value={filters.username}
                onChange={handleFilterChange}
                placeholder="Filter by username..."
              />
            </th>
            <th>
              <input
                className="users-table__head__filters__item"
                type="text"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Filter by email..."
              />
            </th>
            <th>
              <input
                className="users-table__head__filters__item"
                type="text"
                name="phone"
                pattern="[+0-9]*"
                maxLength={12}
                value={filters.phone}
                onChange={handleFilterChange}
                placeholder="Filter by phone number..."
              />
            </th>
          </tr>
        </thead>
        <tbody className="users-table__body">
          {filteredUsers.map((user: User) => (
            <tr key={user.id}>
              <td>
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches("name", user.name),
                  }}
                />
              </td>
              <td>
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches("username", user.username),
                  }}
                />
              </td>
              <td>
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches("email", user.email),
                  }}
                />
              </td>
              <td>
                <span>
                  {
                    <span
                      className="users-table__body__without-span-style"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatches("phone", user.phone),
                      }}
                    />
                  }{" "}
                  {user.ext && (
                    <span className="users-table__body__ext">
                         ext. {user.ext}
                    </span>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
