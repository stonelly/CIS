using AutoMapper;
using CIS.Common.Helper;
using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Request;
using CIS.Data.Model.Response;
using CIS.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CIS.Core.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : Controller
    {
        private readonly IMapper _mapper;
        private IEwareNaviService _EwareNaviService;
        private readonly ILogService _logService;
        private readonly IInventory360Service _inventory360Service;
        private readonly AppSettings _appSettings;

        public UsersController(IMapper mapper, IEwareNaviService EwareNaviService, ILogService logService, IInventory360Service Inventory360Service, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _mapper = mapper;
            _EwareNaviService = EwareNaviService;
            _logService = logService;
            _inventory360Service = Inventory360Service;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public IActionResult Login([FromBody] AuthRequest userParam)
        {
            EwnTblLocationDTO loctinfo = new EwnTblLocationDTO();
            string location = string.Empty;
            string userIP = userParam.IpAddress;
            if (String.IsNullOrEmpty(userParam.UserId) || String.IsNullOrEmpty(userParam.Password))
            {
                ResponseModel resp = new ResponseModel(false);
                return BadRequest(resp);
            }

            if (string.IsNullOrEmpty(userParam.IpAddress))
                userIP = GetClientMachineName(Request);

            //Get from Ewarenavi tbl station
            //var loct = _inventory360Service.GetLocationByIPAddress(userIP);
            //Task.WaitAll(loct);
            //loctinfo = loct.Result;

            //Get from inventory 360 station if ewarenavi can't found
            //if (loct.Result == null)
            //{
            var loct2 = _inventory360Service.GetInv360LocationByIPAddress(userIP);
            Task.WaitAll(loct2);

            if (loct2.Result != null)
            {
                loctinfo = loct2.Result;
            }
            //}

            var user = _EwareNaviService.Authenticate(userParam.UserId, userParam.Password, loctinfo);

            Task.WaitAll(user);

            if (user.Result == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.Unauthorized);
                _logService.CaptureLog("POST", "Login", userParam, resp, null);
                return BadRequest(resp);
            }
            else
            {
                user.Result.LocationTypeDTOs = CommonHelper.GetLocationType();
                ResponseModel resp = new ResponseModel(user.Result);
                _logService.CaptureLog("POST", "Login", userParam, resp, null);
                return Ok(resp);
            }
        }


        [AllowAnonymous]
        [HttpGet("GetMachineIP")]
        public IActionResult GetMachineIP()
        {
            string userIP = GetClientMachineName(Request);            
            ResponseModel resp = new ResponseModel(userIP);
            return Ok(resp);            
        }


        [HttpGet("ValidateEmployeeID")]
        public IActionResult ValidateEmployeeID(string employeeID)
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);

            var employeeInfo = _inventory360Service.GetEmployeeByID(employeeID);
            Task.WaitAll(employeeInfo);

            if (employeeInfo == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                resp.ResponseMessage = "Unable to match EmployeeID";
                _logService.CaptureLog("POST", "ValidateEmployeeID", employeeID, resp, jwt);
                return BadRequest(resp);
            }
            else
            {
                EmployeeDTO emp = new EmployeeDTO();
                emp.TblEmployee = employeeInfo.Result; 
                emp.IsValid = false;
                if (employeeInfo.Result != null)
                    emp.IsValid = !String.IsNullOrEmpty(employeeInfo.Result.EmployeeId);            

                ResponseModel resp = new ResponseModel(emp);
                if (!emp.IsValid)
                    resp.ResponseMessage = "Invalid EmployeeID";

                _logService.CaptureLog("POST", "ValidateEmployeeID", employeeID, resp, jwt);
                return Ok(resp);
            }

        }

        private static string GetClientMachineName(HttpRequest currentRequest)
        {
            string station = "";
            var ClientIPAddr = currentRequest.HttpContext.Connection.RemoteIpAddress;

            //Production
            station= currentRequest.HttpContext.Connection.LocalIpAddress.ToString();
            station = currentRequest.HttpContext.Connection.RemoteIpAddress.ToString();
            var wer = currentRequest.HttpContext.GetServerVariable("REMOTE_HOST");

            //station = currentRequest.ServerVariables["REMOTE_HOST"];
            //station = System.Net.Dns.GetHostEntry(currentRequest.ServerVariables["REMOTE_HOST"]).HostName;
            if (station == "::1")
            {
                station = "192.168.227.90";
            }

            station = station.Replace(".HARTALEGA", "");
            station = station.Replace(".hartalega", "");
            station = station.Replace(".Hartalega", "");
            station = station.Replace(".local", "");
            station = station.Replace(".Local", "");
            station = station.Replace(".LOCAL", "");

            return station;
        }
    }
}
