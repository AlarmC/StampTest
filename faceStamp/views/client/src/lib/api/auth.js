import client from "./client";

// 회원 가입
export const signUp = ({ signName, email, password }) =>
  client.post("/api/signup_user", {
    signName,
    email,
    password,
  });

// 로그인 후 유저 정보 불러오기
export const login = ({ id, password, state }) =>
  client.post("/api/signin", { id, password, state });

export const updateUsers = ({ no }) =>
  client.post("/api/select_user", {
    no,
  });

// export const updateUsers = ({ no, name, filename, image }) =>
//   client.post("/api/update_user", {
//     no,
//     name,
//     filename,
//     image,
//   });
export const snslogin = ({
  id,
  name,
  email,
  mobile,
  image,
  type,
  nickname,
  mode,
}) =>
  client.post("/api/sns_signin", {
    id,
    name,
    mobile,
    email,
    image,
    type,
    nickname,
    mode,
  });

export const creatorClass = ({
  no,
  class_nickname,
  class_title,
  class_hash_1,
  class_hash_2,
  class_hash_3,
  class_hash_4,
  class_hash_5,
  class_hash_6,
  class_date,
  category_one,
  category_two,
  class_type,
  filename,
  image,
}) =>
  client.post("/api/insert_class", {
    no,
    class_nickname,
    class_title,
    class_hash_1,
    class_hash_2,
    class_hash_3,
    class_hash_4,
    class_hash_5,
    class_hash_6,
    class_date,
    category_one,
    category_two,
    class_type,
    filename,
    image,
  });
