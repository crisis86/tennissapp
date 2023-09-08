

export default function handler(request, response) {
    /* if (request.query.key !== 'sharedKey') {
      response.status(404).end();
      return;
    } */

  console.log('hello world')
    /*   response.send({
      status:200,
      message:"hello world"
    }) */
   
    response.status(200).json({ success: true });
   }
  