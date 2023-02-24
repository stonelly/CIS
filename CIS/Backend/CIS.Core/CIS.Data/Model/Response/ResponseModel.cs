using CIS.Data.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model.Response
{
    public class ResponseModel
    {
        public ResponseModel()
        {
            this.ResponseCode = "501";
            this.ResponseMessage = "Not Implemented";
            this.Data = null;
        }

        public ResponseModel(object obj)
        {
            //var json = JsonConvert.SerializeObject(obj);
            this.ResponseCode = "200";
            this.ResponseMessage = "OK";
            this.Data = obj;
        }

        public ResponseModel(bool ret)
        {
            if (ret == false)
            {
                this.ResponseCode = "400";
                this.ResponseMessage = "Bad Request";
                this.Data = null;
            }
            else
            {
                OkModel ok = new OkModel();
                ok.Result = "Success";

                this.ResponseCode = "200";
                this.ResponseMessage = "OK";
                this.Data = ok;
            }
        }

        public ResponseModel(HttpStatusCode code)
        {
            switch (code)
            {
                case HttpStatusCode.Unauthorized:
                    this.ResponseCode = "401";
                    this.ResponseMessage = "Unauthorized";
                    break;
                case HttpStatusCode.NoContent:
                    this.ResponseCode = "204";
                    this.ResponseMessage = "No Content";
                    break;
                case HttpStatusCode.InternalServerError:
                    this.ResponseCode = "500";
                    this.ResponseMessage = "Internal Server Error";
                    break;
                default:
                    this.ResponseCode = Convert.ToInt32(code).ToString();
                    this.ResponseMessage = code.ToString();
                    break;
            }
            this.Data = null;
        }

        public string ResponseCode { get; set; }
        public string ResponseMessage { get; set; }
        public object Data { get; set; }
    }

    public class OkModel
    {
        public string Result { get; set; }
    }

    public class AuditModel
    {
        public string APIOperation { get; set; }
        public string APIFunction { get; set; }
        public object Payload { get; set; }
        public object Returnload { get; set; }
        public string UserId { get; set; }
        public string UserToken { get; set; }
    }

    public class AppSettingDTO
    {
        public string Secret { get; set; }
        public string QAISUrl { get; set; }
        public string CPDHMIUrl { get; set; }
        public string D365Url { get; set; }
        public string baseUrl { get; set; }
    }

    public class JwtDTO
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public string location { get; set; }
        public string locationId { get; set; }
        public string plant { get; set; }
    }
    public class EmployeeDTO
    {
        public bool IsValid { get; set; }
        public TblEmployee TblEmployee { get; set; }
    }
}
