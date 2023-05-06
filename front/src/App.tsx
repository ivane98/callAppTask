import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { User } from "../types";
import { Button, Space, Table } from "antd";
import { Link } from "react-router-dom";
import { useUserStore } from "./store";
import AddUserModal from "./components/AddModal";
import EditUserModal from "./components/EditModal";

function App() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add");
  const state = useUserStore();
  const [user, setUser] = useState<User>({
    _id: "",
    id: null,
    name: "",
    phone: "",
    gender: "",
    email: "",
    address: {
      city: "",
      street: "",
    },
  });

  const columns: any = [
    {
      title: "Name",
      render: (user: User) => user.name,
    },
    {
      title: "Email",
      render: (user: User) => user.email,
    },
    {
      title: "City",
      render: (user: User) => user.address.city,
    },
    {
      title: "Street",
      render: (user: User) => user.address.street,
    },
    {
      title: "Gender",
      render: (user: User) => user.gender,
    },
    {
      title: "Phone",
      render: (user: User) => user.phone,
    },
    {
      render: (user: User) => (
        <Space wrap>
          <Button
            type="primary"
            style={{ background: "red" }}
            onClick={(e) => onDeleteHandler(e, user._id)}
          >
            DELETE
          </Button>
        </Space>
      ),
    },
    {
      render: (user: User) => (
        <Space wrap>
          <Button
            type="primary"
            style={{ background: "blue" }}
            onClick={() => toggle("edit", user)}
          >
            EDIT
          </Button>
        </Space>
      ),
    },
  ];

  const onDeleteHandler = async (event: any, id: any) => {
    event.preventDefault();

    await axios.delete(`http://localhost:3000/users/${id}`);

    state.deleteUser(id);
    setLoading(!loading);
  };

  const [modal, setModal] = useState(false);

  const toggle = (mode: "add" | "edit", user?: User) => {
    setModal(!modal);
    setMode(mode);
    if (user) {
      setUser(user);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => {
        const users: User[] = [];
        const cities: { [key: string]: number } = {};
        for (const [key, value] of Object.entries(res.data)) {
          (value as User)._id = key;
          const user: User = value as User;
          users.push(user);

          const cityAmount = cities[user.address.city];
          if (cityAmount) {
            cities[user.address.city] = cityAmount + 1;
          } else {
            cities[user.address.city] = 1;
          }
        }
        state.setSeries(Object.values(cities));
        state.setOptions({ ...state.opts, labels: Object.keys(cities) });
        state.setUsers(users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loading]);

  return (
    <div>
      <div>
        <Space wrap>
          <Button
            type="primary"
            style={{
              background: "green",
              margin: "10px",
            }}
            onClick={() => toggle("add")}
          >
            Add New User
          </Button>
        </Space>
        <Link to={`/chart`}>
          <Button
            type="primary"
            style={{
              background: "green",
              margin: "10px",
            }}
          >
            View Chart
          </Button>
        </Link>
        {mode === "add" ? (
          <AddUserModal
            loading={loading}
            modal={modal}
            setLoading={setLoading}
            setModal={setModal}
            toggle={() => toggle("add")}
          />
        ) : (
          <EditUserModal
            loading={loading}
            modal={modal}
            setLoading={setLoading}
            setModal={setModal}
            toggle={() => toggle("edit")}
            id={user._id}
            name={user.name}
            city={user.address.city}
            email={user.email}
            gender={user.gender}
            phone={user.phone}
            street={user.address.street}
          />
        )}
      </div>
      <div>
        <Table columns={columns} dataSource={state.users} pagination={false} />
      </div>
    </div>
  );
}

export default App;
