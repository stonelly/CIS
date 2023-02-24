export class loginAPI {
    /*ResponseCode: string;
    ResponseMessage: string;
    Data?: DataContent;*/
    responseCode: string;
    responseMessage: string;
    data?: DataContent;
}

class DataContent{
   /*AppId: string;
   Token: string;
   TokenExpiry: Date;
   base64img: string;
   Name: string;
   Email: string;*/

   token: string;
   tokenExpiry: Date;
   base64img: string;
   name: string;
   email: string;
   userId: string;
   roleId: string;
   locationId: string;
   location: string;
}