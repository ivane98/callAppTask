import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../store";
import { User } from "../../types";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import { Button } from "antd";

const Chart = () => {
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => {
        const users: User[] = [];
        const cities: { [key: string]: number } = {};
        // console.log(res.data);
        for (const [key, value] of Object.entries(res.data)) {
          (value as User)._id = key;
          const user: User = value as User;
          // console.log(user.address);
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
        console.log(users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loading]);
  return (
    <>
      <h1>Pie Chart</h1>
      <ReactApexChart
        options={state.opts as any}
        series={state.series as any}
        type="pie"
        width={500}
        height={320}
      />
      <Link to={`/`}>
        <Button
          type="primary"
          style={{
            background: "green",
            margin: "10px",
          }}
        >
          View Table
        </Button>
      </Link>
    </>
  );
};

export default Chart;
