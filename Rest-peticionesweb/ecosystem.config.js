module.exports = {
    apps : [{
      name: "ServerPeticionesWeb",
      script: "src/index.js",
      watch: true,
      max_memory_restart: '2048M',
      exec_mode:"cluster",
      instances: 1,
      cron_restart:"59 23 * * *",
      env:{
        NODE_ENV:"development",
      },
      env_production:{
        NODE_ENV:"production",
      }

    }]
  }