using AutoMapper;
using CIS.Common.Helper;
using CIS.Data.Model;
using CIS.Data.Model.Request;
using CIS.Data.Model.Response;
using CIS.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public class LocationController : Controller
    {
        private readonly IMapper _mapper;
        private IEwareNaviService _EwareNaviService;
        private IInventory360Service _Inventory360Service;
        private readonly ILogService _logService;

        public LocationController(IMapper mapper, IEwareNaviService EwareNaviService, IInventory360Service Inventory360Service, ILogService logService)
        {
            _mapper = mapper;
            _EwareNaviService = EwareNaviService;
            _Inventory360Service = Inventory360Service;
            _logService = logService;
        }

        [HttpGet("GetAllLocation")]
        public IActionResult GetAllLocation()
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);
            var LocationInfo = _Inventory360Service.AllLocationInfo();
            Task.WaitAll(LocationInfo);

            if (LocationInfo.Result == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.Unauthorized);
                _logService.CaptureLog("GET", "GetAllLocation", null, resp, jwt);
                return BadRequest(resp);
            }
            else
            {
                //var result = _mapper.Map<List<EwnTblLocationDTO>>(LocationInfo.Result);
                ResponseModel resp = new ResponseModel(LocationInfo.Result);
                _logService.CaptureLog("GET", "GetAllLocation", null, resp, jwt);
                return Ok(resp);
            }

        }

        [HttpGet("GetLocation")]
        public IActionResult GetLocation(int LocationID)
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);
            var LocationInfo = _Inventory360Service.LocationInfo(LocationID);
            Task.WaitAll(LocationInfo);

            if (LocationInfo.Result == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                resp.ResponseMessage = "Unable to match LocationID";
                _logService.CaptureLog("GET", "GetLocation", LocationID, resp, jwt);
                return BadRequest(resp);
            }
            else
            {
                var result = _mapper.Map<EwnTblLocationDTO>(LocationInfo.Result);
                ResponseModel resp = new ResponseModel(result);
                _logService.CaptureLog("GET", "GetLocation", LocationID, resp, jwt);
                return Ok(resp);
            }

        }

        [HttpPost("UpdateLocation")]
        public IActionResult UpdateLocation([FromBody] EwnTblLocationDTO request)
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);

            var LocationInfo = _Inventory360Service.UpdateLocationInfo(request);
            Task.WaitAll(LocationInfo);

            if (LocationInfo == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                resp.ResponseMessage = "Unable to update Location";
                _logService.CaptureLog("POST", "UpdateLocation", request, resp, jwt);
                return BadRequest(resp);
            }
            else
            {
                ResponseModel resp = new ResponseModel(LocationInfo.Result);
                _logService.CaptureLog("POST", "UpdateLocation", request, resp, jwt);
                return Ok(resp);
            }

        }

        [HttpPost("RemoveLocation")]
        public IActionResult RemoveLocation([FromBody] EwnTblLocationDTO request)
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);
            var LocationInfo = _Inventory360Service.DeleteLocationInfo(request.LocationId);
            Task.WaitAll(LocationInfo);

            if (LocationInfo == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                resp.ResponseMessage = "Unable to remove LocationID";
                _logService.CaptureLog("POST", "RemoveLocation", request, resp, jwt);
                return BadRequest(resp);
            }
            else
            {
                ResponseModel resp = new ResponseModel(LocationInfo.Result);
                _logService.CaptureLog("POST", "RemoveLocation", request, resp, jwt);
                return Ok(resp);
            }

        }
    }
}
