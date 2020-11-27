# GuessWhoGame
Guess who Game with custom characters

Built using Node and Express.

Hosted at https://guess-who-server12.herokuapp.com

### To Run locally

1. Create an amazon S3 Bucket (Free tier eligible)

2. Create .env file with these values from your bucket
 - AWS_BUCKET_NAME
 - AWS_ACCESS_KEY_ID
 - AWS_SECRET_KEY
 - AWS_REGION
 - AWS_UPLOAD_URL (example: s3://guess-who-static-files)


3. Run `npm install` to install dependencies

4. Run `npm start` to start server.

Known issues:
 - No way to run locally without using S3.
