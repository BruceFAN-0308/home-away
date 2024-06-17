

# 								Home-away v1.0.0



## Deploye Link:

https://home-away-bruce.vercel.app/



## Deployment and Usage

1. Install project dependencies using npm:

```
npm install
```



2. Please create a new `.env` file from `.env.example` file in the project root directory to define the required environment variables. This step is crucial (for image upload to OSS):

```
NEXT_PUBLIC_ACCESS_TOKEN_SECRET=<your token secret>
NEXT_PUBLIC_ALI_REGION=<your ali endpoint>
NEXT_PUBLIC_ALI_BUCKET_NAME=<your ali bucket name>
NEXT_PUBLIC_ALI_ACCESS_KEY=<your ali access key>
NEXT_PUBLIC_ALI_SECRET_KEY=<your ali secret key>
NEXT_PUBLIC_ALI_ACS_RAM_NAME=<your ali acs:ram name>
NEXT_PUBLIC_ALI_FILES_PATH=<your ali files pathname>
```



3. Run the project:

```
npm run dev 
```



4. Prisma set up

```
npx prisma db push
```



## Tech:

1. TypeScript
2. Next.js
3. Tailwind CSS
4. Shadcn ui
5. PostgreSQL
6. Supabase
7. Prisma ORM
8. Clerk
9. Vercel
10. Stripe



## Project Highlights

1. Independently developed and designed a complete clone of the Airbnb website, including Front-end and Back-end.
2. Built a user-friendly interface using **Next.js**, ensuring responsive design for desktop, tablet, and mobile devices. Employed a headless UI style with **Shadcn ui** and **Tailwind CSS** for styling.

3. Utilized **PostgreSQL** and **SupaBase** for data storage and management, enabling CRUD operations for listings, user data, and booking records. Employed **Prisma** as the ORM framework to streamline database interactions.

4. Implemented user registration and login functionalities using **Clerk**, including **OAuth2.0 third-party logins**, including Google, GitHub, and Facebook.

5. Used **Vercel** for continuous integration and deployment, ensuring quick launch and stable operation of the project.

6. Used **Stripe** for payment processing, enabling users to book listings and pay for services securely.
