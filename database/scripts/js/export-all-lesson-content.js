#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { Pool } = require('pg')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

// Returns the DATABASE_URL value for the provided Heroku app
async function getHerokuConnectionString ({ appName }) {
  const command = `heroku config:get DATABASE_URL -a ${appName}`
  try {
    const { stdout } = await exec(command)
    return stdout.trim()
  } catch (error) {
    console.log(`Unable to get connection string for Heroku app '${appName}'.`)
    console.log('Run the following command for more info:')
    console.log(command)
    process.exit(1)
  }
}

// Saves the content of all lessons in the provided app's database to
// separate files in the specified output directory
async function exportAllLessonContent ({ appName, outputDir }) {
  await exec(`mkdir -p ${outputDir}`)

  const connectionString = await getHerokuConnectionString({ appName })
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })

  const client = await pool.connect()
  const result = await client.query('select lesson_key, content from lesson')
  for (const row of result.rows) {
    const lessonKey = row.lesson_key
    const filename = path.join(outputDir, `${appName}~${lessonKey}.md`)

    fs.writeFile(filename, row.content, () => {
      console.log('Exported', filename)
    })
  }
  client.release()
}

//
// Gather command line arguments and start the export
//

if (process.argv.length !== 4) {
  console.log('usage: export-all-lesson-content.js <appname> <outputdir>')
  process.exit(1)
}

const appName = process.argv[2]
const outputDir = process.argv[3]

exportAllLessonContent({ appName, outputDir })
