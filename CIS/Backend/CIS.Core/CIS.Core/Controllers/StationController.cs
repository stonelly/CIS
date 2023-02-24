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
    public class StationController : Controller
    {
        private readonly IMapper _mapper;
        private IEwareNaviService _EwareNaviService;
        private IInventory360Service _Inventory360Service;
        private readonly ILogService _logService;

        public StationController(IMapper mapper, IEwareNaviService EwareNaviService, IInventory360Service Inventory360Service, ILogService logService)
        {
            _mapper = mapper;
            _EwareNaviService = EwareNaviService;
            _Inventory360Service = Inventory360Service;
            _logService = logService;
        }

        [HttpGet("GetAllStation")]
        public IActionResult GetAllStation()
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);
            var stationInfo = _Inventory360Service.AllStationInfo();
            Task.WaitAll(stationInfo);

            if (stationInfo.Result == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.Unauthorized);
                _logService.CaptureLog("GET", "GetAllStation", null, resp, jwt);
                return BadRequest(resp);
            }
            else
            {
                //var result = _mapper.Map<List<EwnTblStationPcDTO>>(stationInfo.Result);
                ResponseModel resp = new ResponseModel(stationInfo.Result);
                _logService.CaptureLog("GET", "GetAllStation", null, resp, jwt);
                return Ok(resp);
            }

        }

        [HttpGet("GetStation")]
        public IActionResult GetStation(int stationID)
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);
            var stationInfo = _Inventory360Service.StationInfo(stationID);
            Task.WaitAll(stationInfo);

            if (stationInfo.Result == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                resp.ResponseMessage = "Unable to match stationID";
                _logService.CaptureLog("GET", "GetStation", stationID, resp, jwt);
                return BadRequest(resp);
            }
            else
            {
                var result = _mapper.Map<EwnTblStationPcDTO>(stationInfo.Result);
                ResponseModel resp = new ResponseModel(result);
                _logService.CaptureLog("GET", "GetStation", stationID, resp, jwt);
                return Ok(resp);
            }

        }

        [HttpPost("UpdateStation")]
        public IActionResult UpdateStation([FromBody]EwnTblStationPcDTO request)
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);

            var stationInfo = _Inventory360Service.UpdateStationInfo(request);
            Task.WaitAll(stationInfo);

            if (stationInfo == null)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                resp.ResponseMessage = "Unable to update stationPC";
                _logService.CaptureLog("POST", "UpdateStation", request, resp, jwt);
                return BadRequest(resp);
            }
            else
            {
                ResponseModel resp = new ResponseModel(stationInfo.Result);
                _logService.CaptureLog("POST", "UpdateStation", request, resp, jwt);
                return Ok(resp);
            }

        }

    }
}
