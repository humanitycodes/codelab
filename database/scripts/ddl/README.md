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

Run each DDL script in numerical order using `psql`. For example:

``` sh
psql -f 20180605-01-db-and-users.sql
```

If you need to start a database completely from scratch, losing all data in the
process, you can use the following commands in an interactive `psql` session to
do so:

``` sql
DROP DATABASE IF EXISTS codelab;
DROP ROLE IF EXISTS codelab_app;
DROP ROLE IF EXISTS codelab_admin;
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
local   all             codelab_app                             password
host    all             codelab_app     127.0.0.1/32            password
host    all             codelab_app     ::1/128                 password
```

Third, restart the Postgres server. If you use the `pg_ctl` command, then
run it as follows:

``` sh
pg_ctl restart -D <DATAFILE>
```

Where `<DATAFILE>` can be found by running the following SQL:

``` sql
select setting
from pg_settings
where name = 'data_directory';
```
