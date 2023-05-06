import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Options, User } from "../types";

interface UserState {
  users: Array<User>;
  series: Array<Number>;
  opts: Options;
  setSeries: (series: number[]) => void;
  setOptions: (opts: Options) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  editUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        users: [],
        series: [],
        opts: {
          chart: {
            width: 380,
            type: "pie",
          },
          labels: [],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
        setSeries: (series) => set((state) => ({ series })),
        setOptions: (opts) => set((state) => ({ opts })),
        setUsers: (users) => set((state) => ({ users })),
        addUser: (user) => set((state) => ({ users: [...state.users, user] })),
        editUser: (user) =>
          set((state) => ({
            users: state.users.map(function (u) {
              return u._id === user._id ? user : u;
            }),
          })),
        deleteUser: (userId) =>
          set((state) => ({
            users: state.users.filter((user) => user._id !== userId),
          })),
      }),
      {
        name: "user-store",
      }
    )
  )
);
