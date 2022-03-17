module.exports = {
  apps: [
    {
      name: "guard_1",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./apps/Guard_1"
    },
    {
      name: "guard_2",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./apps/Guard_2"
    },
    {
      name: "guard_3",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./apps/Guard_3"
    },
    {
      name: "guard_4",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./apps/Guard_4"
    },
    {
      name: "guard_5",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./apps/Guard_5"
    },
    {
      name: "registry",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./apps/Registry"
    },
    {
      name: "moderator",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./apps/Moderator"
    }
  ]
};
