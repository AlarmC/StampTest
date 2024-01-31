import client from "./client";

export const getList = ({ id }) =>
  client.post("/api/select_list", {
    id,
});

export const sendList = ({ user, list_no}) =>
  client.post("/api/send_list", {
    user, list_no
})