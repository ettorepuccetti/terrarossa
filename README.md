# Terrarossa

## Next.js
npm run dev

## DB 
### Planetscale
(optional)
brew install planetscale/tap/pscale
pscale connect terrarossa main --port 3309
altrimenti connettersi direttamente con DATABASE_URL in .env

### Prisma studio
npx prisma studio

### DB changes
in .env cambiare il DATABASE_URL a quello del branch
riavviare npm run dev
npx prisma push db 
npx prisma generate


## Privacy policy
generated using https://www.freeprivacypolicy.com/free-terms-and-conditions-generator/
account: terrarouge.vercel@gmail.com