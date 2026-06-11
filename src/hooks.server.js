export async function handle({ event, resolve }) {
  const response = await resolve(event);

  response.headers.set(
    'cache-control',
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
  );

  return response;
}