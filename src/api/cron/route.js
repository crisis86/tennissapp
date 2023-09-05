
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sharedKey = searchParams.get('sharedKey');
    if (!sharedKey) {
      return new Response('Failed to get sharedKey', { status: 200 });
    }
      return new Response('Successfully got sharedKey: '+sharedKey, { status: 200 });
  } 