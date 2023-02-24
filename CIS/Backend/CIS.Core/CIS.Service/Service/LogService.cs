using CIS.Common.Constants;
using CIS.Common.Helper;
using CIS.Common.Utils;
using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Response;
using CIS.Services.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Services.Service
{
    public class LogService : ILogService
    {
        private readonly B2SDBContext _db;

        public LogService(IOptions<AppSettings> appSettings, B2SDBContext db)
        {
            _db = db;
        }

        #region Log
        public async Task<bool> CaptureLog(string APIOperation, string APIFunction, object Payload, object ReturnLoad, JwtDTO jwt)
        {
            bool ret = false;

            try
            {
                ApiauditLog adl = new ApiauditLog();
                adl.Apifunction = APIFunction;
                adl.Apioperation = APIOperation;
                adl.PayLoad = JsonConvert.SerializeObject(Payload);
                adl.ReturnLoad = JsonConvert.SerializeObject(ReturnLoad);
                adl.CreatedDateTime = DateTime.Now;
                if (jwt != null)
                {
                    adl.UserId = jwt.UserId;
                    adl.UserToken = jwt.Token;
                }
                else
                {
                    adl.UserId = "";
                    adl.UserToken = "";
                }

                await _db.ApiauditLogs.AddAsync(adl);

                 _db.SaveChanges();


                ret = true;
            }
            catch (Exception ex)
            {
                ret = false;
            }          

            return ret;
        }

        #endregion
    }
}
