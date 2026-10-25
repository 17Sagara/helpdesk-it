This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🧪 Pruebas de API REST & QA (Postman)

El proyecto cuenta con una suite de pruebas para la API REST de Supabase alojada en la carpeta `/postman`.

### Peticiones Incluidas
* **`GET /rest/v1/tickets`**: Consulta e inspección de tickets guardados (sincronizados con la app web).
* **`POST /rest/v1/tickets`**: Inserción de nuevos tickets con validación de clave foránea (`client_id`).
* **`GET /rest/v1/profiles`**: Consulta de usuarios para garantizar la integridad relacional de la base de datos.

### Cómo importar en Postman
1. Abre **Postman**.
2. Haz clic en **Import** (esquina superior izquierda).
3. Selecciona el archivo `postman/HelpDesk_QA_API.postman_collection.json`.
4. Configura los Headers `apikey` y `Authorization` (Bearer token) con tus credenciales de Supabase.