import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function POST(req) {
  try {
    const body = await req.json();
    const { serviceType, postcode, propertyType, email, price } = body;

    if (!serviceType || !postcode || !propertyType || !email) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    await sql`
      INSERT INTO anfragen (service_type, postcode, property_type, email, price, created_at)
      VALUES (${serviceType}, ${postcode}, ${propertyType}, ${email}, ${price}, NOW())
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM anfragen ORDER BY created_at DESC`;
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Database fetch failed' }, { status: 500 });
  }
}
