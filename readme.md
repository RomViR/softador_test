## Test app - distance calculator

###Installation

Clone the project from repository to the preferred location.
All the shell input examples below are shown from the project's root folder.

Environment needs to meet Laravel 5.8 requirements
https://laravel.com/docs/5.8/installation#server-requirements

MySQL 5.7+ is used for app user data
https://dev.mysql.com/downloads/mysql/5.7.html

MongoDB 4.2 is used for vehicle and location data 
https://docs.mongodb.com/manual/administration/install-community/

Please make sure respective PHP extensions php7.x-mysql and php-mongodb are installed
and services are running

Node.js and npm are used to manage frontend packages https://www.npmjs.com/get-npm

Import MongoDB data dump. I had to "hide" .json files to restore data successfully.
```
mongorestore --drop -d iGeoTrack path/to/dump/folder
```

Set up Laravel's directories and permissions to them
```
php artisan storage:link
sudo chmod -R 777 storage
sudo chmod -R 777 bootstrap/cache
```

Set up your web server to point to project's public directory.
Or use PHP's built-in server by running `php artisan serve`

Make a copy of `.env.example` file and name it `.env`. 
Make sure to set up both DB's connection details and mail server details in the `.env`. 
Generate app encryption key and jwt key by running 
```
php artisan key:generate
php artisan jwt:secret
```

Install backend and frontend packages by running
```
composer install
npm install
```

Compile assets by running
```
gulp
```

Run MySQL migrations
```
php artisan migrate
```