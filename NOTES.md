# Terrarossa

## Next.js

npm run dev

## DB

### Planetscale

(optional)
brew install planetscale/tap/pscale
pscale connect terrarossa main --port 3309

altrimenti connettersi direttamente con DATABASE_URL in .env

### Prisma seed
npx prisma db seed

### Prisma studio

npx prisma studio

### Docker

docker run --name mysql-terrarossa -e MYSQL_ROOT_PASSWORD=secret -p 3306:3306 -d mysql

### DB changes

in .env cambiare il DATABASE_URL a quello del branch
riavviare npm run dev
npx prisma db push
npx prisma generate
(reminder: cambiamenti ai prisma tag non richiedono deployment, si riflettono solo su prisma studio e prisma generate)
mergiare da planetscale.com

## Privacy policy

generated using https://www.freeprivacypolicy.com/free-terms-and-conditions-generator/
account: terrarouge.vercel@gmail.com

## Cypress

to avoid missing env variables, in package.json use:

```
"scripts": {
  "cypress": "NODE_ENV='test' cypress open"
}
```
