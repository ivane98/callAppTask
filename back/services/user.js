import fs from "fs";

export async function getUsers() {
  let rawdata = fs.readFileSync("././users.json");
  let users = JSON.parse(rawdata);
  return users;
}

export async function addUser(user) {
  let data = fs.readFileSync("././users.json");
  let myObject = JSON.parse(data);

  myObject.push(user);
  let newData2 = JSON.stringify(myObject);
  fs.writeFile("././users.json", newData2, (err) => {
    if (err) throw err;
    console.log("New data added");
  });
}

export async function deleteUser(id) {
  let data = fs.readFileSync("././users.json");
  let myObject = JSON.parse(data);

  let remnantData = [];
  myObject.forEach((element) => {
    if (myObject.indexOf(element) != id) {
      remnantData.push(element);
    }
  });

  fs.writeFile("././users.json", JSON.stringify(remnantData), function (err) {
    if (err) {
      console.log(err);
    }
    console.log("Deleted!");
  });
}

export async function editUser(id, user) {
  let data = fs.readFileSync("././users.json");
  let myObject = JSON.parse(data);

  let current;

  myObject.forEach((element) => {
    if (myObject.indexOf(element) == id) {
      current = element;

      current.name = user.name;
      current.email = user.email;
      current.phone = user.phone;
      current.gender = user.gender;
      current.address = {
        street: user.address.street,
        city: user.address.city,
      };
    }
  });

  fs.writeFile("././users.json", JSON.stringify(myObject), function (err) {
    if (err) {
      console.log(err);
    }
    console.log("updated");
  });
}
