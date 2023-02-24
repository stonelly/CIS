using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Services.Interface
{
    public interface ILogService
    {
        Task<bool> CaptureLog(string APIOperation, string APIFunction, object Payload, object ReturnLoad, JwtDTO jwt);
    }
}
