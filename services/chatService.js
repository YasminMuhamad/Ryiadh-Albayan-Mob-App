const RECOMMEND_API_URL = 'https://ai-course-engine.vercel.app/api/recommend';

export const queryCourse = async (userQuery) => {
  if (!userQuery) return null;

  try {
    const res = await fetch(RECOMMEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!res.ok) {
      console.error('Error calling recommend API:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return data.result || null;
  } catch (err) {
    console.error('queryCourse error:', err);
    return null;
  }
};
