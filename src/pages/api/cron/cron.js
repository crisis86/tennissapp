

export default function handler(request, response) {
    /* if (request.query.key !== 'sharedKey') {
      response.status(404).end();
      return;
    } */
   
    response.status(200).json({ success: true });
  }
  