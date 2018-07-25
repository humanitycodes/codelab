import sequelize from 'db/sequelize'

export default ({ exit }) => {
  return async () => {
    console.log('Shutting down...')
    await sequelize.close()
    console.log('Disconnected from database')
    if (exit) {
      console.log('Exiting...')
      process.exit(0)
    }
  }
}
