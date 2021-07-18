### Heartbeat App

### Installation


`npm install`

### Running

This app requires docker or a local mongodb installation.  If using a local mongodb, see `app.module.ts` for connection options, and make sure there are matching options for the mongodb installation and the source code.

#### Docker

There is a `docker-compose.yml` file for starting Docker.

`docker-compose up`

After running the sample, you can stop the Docker container with

`docker-compose down`

### Environment Variables
Create a .env file with 2 keys:
* `INSTANCE_EXPIRATION_TIME_MS` - to set an instance expiration time in milliseconds
* `INSTANCE_EXPIRATION_CHECK_INTERVAL_MS` - to set a periodic job checking interval in milliseconds
Defaults for this variables are 1 min and 30 sec respectively

### Run the sample

Then, run Nest as usual:

`npm run start`

