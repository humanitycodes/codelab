# Configuring Postgres

Please follow the instructions below, in order, before attempting to run the
software in this project.

## 1. Install Postgres

This software requires [Postgres 10.x](https://www.postgresql.org/download/).
It can be installed locally or on a remote server.

The provided link is useful for local installation. For installation on Heroku
or some other remote provider, you should follow their instructions to install
a new Postgres instance.

## 2. Configure timezone

The default installation of Postgres usually configures timestamps to be read
from the database using the system's default timezone instead of UTC. To ensure
that Postgres always treats timestamps with no timezone as UTC, update the
`postgresql.conf` file on the Postgres server.

First, locate the `postgresql.conf` file by running the following SQL on the
server:

``` sql
SHOW hba_file;
```

The `postgresql.conf` file will be in the same directoy as the `pg_hba.conf`
file.

Second, replace the line starting with `timezone =` with the following:

```
timezone = 'UTC'
```

Finally, restart the Postgres server for the change to take effect. If you use
the `pg_ctl` command, then run it as follows:

``` sh
pg_ctl restart -D <DATAFILE>
```

Where `<DATAFILE>` can be found by running the following SQL:

``` sql
select setting
from pg_settings
where name = 'data_directory';
```

## 3. Run DDL scripts

> ### When starting from scratch
>
> Before running the script `00-db-and-users.ddl`,
> make sure that the `CODELAB_DB_PASSWORD` environment variable is set! This
> environment variable is used by the DDL script to set the password of the
> `codelab_app` user as well as by the application when connecting to the
> database.

Run each DDL script in numerical order using `psql`. The first script,
`00-db-and-users.ddl`, should run as a database administrator account (usually
leaving off any specific database and user will work). All subsequent scripts
(i.e. all scripts with the `.sql` extension) should connect to the `codelab`
database using the `codelab_app` user.

For example:

``` sh
psql -a -f 00-db-and-users.ddl
psql -a -w -U codelab_app -d codelab -f 20180605-01-initial-tables.sql
```

Heroku databases use a different, pre-generated user and database. To run
scripts on a Heroku database, skip the `00-db-and-users.ddl` file and run the
`.sql` scripts like this, making sure to replace `msu-codes-staging` with the
appropriate Heroku app name:

``` sh
cat 20180605-01-initial-tables.sql | heroku pg:psql -a msu-codes-staging
```

If you need to start a database completely from scratch, losing all data in the
process, you can use the following commands in an interactive `psql` session to
do so:

``` sql
DROP DATABASE IF EXISTS codelab;
DROP ROLE IF EXISTS codelab_app;
```

Or if you really goofed and need to drop individual objects:

``` sql
DROP TABLE project_completion;
DROP TABLE course_student_pending;
DROP TABLE course_student;
DROP TABLE course_instructor;
DROP TABLE course_lesson;
DROP TABLE course;
DROP TABLE lesson_prerequisite;
DROP TABLE lesson_project_criterion;
DROP TABLE lesson_learning_objective;
DROP TABLE lesson;
DROP TABLE app_user;
DROP SEQUENCE id_sequence;
DROP DATABASE IF EXISTS codelab;
DROP ROLE IF EXISTS codelab_app;
```

Then you can run all of the scripts in order by using the following shell
script:

``` sh
psql -a -f 00-db-and-users.ddl

for sqlfile in `ls -1 *.sql | sort`; do
  echo Running ${sqlfile}
  psql -a -w -U codelab_app -d codelab -f "${sqlfile}"
  if test $? -ne 0; then
    echo Error encountered running ${sqlfile}. Aborting...
    exit 1
  fi
done
```

To test that you can connect to the new database as the `codelab_app` user
(which is the user that the application uses), use the following command and
provide the password from the environment variable `CODELAB_DB_PASSWORD` when
prompted:

``` sh
psql -U codelab_app -d codelab
```

## 4. Secure database access

By default, Postgres allows local connections without collecting or verifying
a password. To ensure a password is required for users of the `codelab`
database, update the `pg_hba.conf` file on the Postgres server.

First, locate the `pg_hba.conf` file by running the following SQL on the server:

``` sql
SHOW hba_file;
```

Second, add the following lines to the _front_ of the `pg_hba.conf` file:

```
local   all             codelab_app                             trust
host    all             codelab_app     127.0.0.1/32            trust
host    all             codelab_app     ::1/128                 trust
```

Third, restart the Postgres server. If you use the `pg_ctl` command, then
run it as follows:

``` sh
pg_ctl restart -D <DATAFILE>
```

Where `<DATAFILE>` can be found by running the following SQL:

``` sql
SELECT setting FROM pg_settings WHERE name = 'data_directory';
```
