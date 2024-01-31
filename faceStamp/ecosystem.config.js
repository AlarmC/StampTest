module.exports = {
  apps: [
    {
      name: "yjsoftwebserver",
      script: "./app.js",
      instances: 0, // 0일 경우 CPU 코어 수 만큼 프로세스를 생성
      exec_mode: "cluster",
    },
  ],
};
