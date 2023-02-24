using AutoMapper;
using CIS.BusinessLogic.Pallet;
using CIS.Common.Constants;
using CIS.Common.Helper;
using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Request;
using CIS.Data.Model.Response;
using CIS.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
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
    public class StockMasterController : ControllerBase
    {
        private IMemoryCache _cache;
        private IEwareNaviService _EwareNaviService;
        private IInventory360Service _Inventory360Service;
        private readonly IFloorSystemrService _floorSystemrService;
        private readonly ILogService _logService;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        public StockMasterController(IEwareNaviService EwareNaviService, IInventory360Service Inventory360Service, IFloorSystemrService FloorSystemrService, IMapper mapper, ILogService logService, IOptions<AppSettings> appSettings, IMemoryCache cache)
        {
            _appSettings = appSettings.Value;
            _EwareNaviService = EwareNaviService;
            _Inventory360Service = Inventory360Service;
            _floorSystemrService = FloorSystemrService;
            _logService = logService;
            _mapper = mapper;
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        [HttpGet("GetPalletInfo")]
        public IActionResult GetPalletInfo(string palletNo)
        {
            JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);
            PalletInfoDTO palletInfo = new PalletInfoDTO();

            //var palletInfo = _Inventory360Service.StockInfo(palletID);
            //Task.WaitAll(palletInfo);

            var mto = _floorSystemrService.USP_EWN_GetPalletData(palletNo);
            var mts = _Inventory360Service.GetPalletInfo(palletNo);
            Task.WaitAll(mts);
            Task.WaitAll(mto);

            var stockType = StockBLL.GetPalletType(mto.Result, mts.Result);
            palletInfo.PalletNo = palletNo;

            //To avoid cache in jwt, retrieve location with machine IP address
            var machineIP = CommonHelper.GetClientMachineName(Request);
            var loct2 = _Inventory360Service.GetInv360LocationByIPAddress(machineIP);
            Task.WaitAll(loct2);

            if (loct2.Result != null && loct2.Result.LocationId > 0)
            {
                jwt.locationId = loct2.Result.LocationId.ToString();
                jwt.location = loct2.Result.LocationName;
            }

            switch (stockType)
            {
                case (int)GlobalConst.StockMTO_MTS.MTO:
                    palletInfo.PalletType = Enum.GetName(typeof(GlobalConst.StockMTO_MTS), GlobalConst.StockMTO_MTS.MTO);
                    palletInfo.EWN_CompletedPalletList = mto.Result;

                    StockBLL.GenerateCustPOPLanDay(_EwareNaviService, palletInfo.EWN_CompletedPalletList);
                    palletInfo.ErrorMessage = MTOBLL.IsValidPallet(_EwareNaviService, _floorSystemrService, mto.Result, jwt, palletNo);
                    palletInfo.IsValidCheckIn = string.IsNullOrEmpty(palletInfo.ErrorMessage);
                    break;
                case (int)GlobalConst.StockMTO_MTS.MTS:
                    palletInfo.PalletType = Enum.GetName(typeof(GlobalConst.StockMTO_MTS), GlobalConst.StockMTO_MTS.MTS);
                    palletInfo.PalletDetailList = mts.Result;

                    palletInfo.ErrorMessage = MTSBLL.IsValidPallet(mts.Result, jwt);
                    palletInfo.IsValidCheckIn = string.IsNullOrEmpty(palletInfo.ErrorMessage);

                    if(palletInfo.PalletDetailList.Count() > 0)
                    {
                        palletInfo.StockId = palletInfo.PalletDetailList.FirstOrDefault().StockID;
                    }

                    int locationID = Int32.Parse(jwt.locationId);
                    var binLocationLst = _Inventory360Service.GetTblBinLocationByLocationID(locationID).Result;
                    palletInfo.tblBinLocation = binLocationLst;
                    break;
                default:
                    palletInfo.PalletType = Enum.GetName(typeof(GlobalConst.StockMTO_MTS), GlobalConst.StockMTO_MTS.None);
                    break;
            }

            if (string.IsNullOrEmpty(palletNo))
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                _logService.CaptureLog("GET", "GetPalletInfo", palletNo, resp, jwt);
                return BadRequest(resp);
            }
            else
            {                 
                ResponseModel resp = new ResponseModel(palletInfo);
                resp.ResponseMessage = palletInfo.ErrorMessage;
                _logService.CaptureLog("GET", "GetPalletInfo", palletNo, resp, jwt);
                return Ok(resp);                
            }
        }


        [HttpPost("CheckInPallet")]
        public IActionResult CheckInPallet([FromBody] CheckInPalletDTO request)
        {
            try
            {
                JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);

                if (request == null || String.IsNullOrEmpty(request.PalletType))
                {
                    ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                    resp.ResponseMessage = "Invalid request";
                    _logService.CaptureLog("POST", "CheckInPallet", request, resp, jwt);
                    return BadRequest(resp);
                }

                string userToken = string.Empty;

                //Checking is submission 5 second before, if yes just stop process for below action
                _cache.TryGetValue(GlobalConst.Submit_Token, out userToken);
                if (!string.IsNullOrEmpty(userToken) && userToken == jwt.Token)
                {
                    ResponseModel resp = new ResponseModel(HttpStatusCode.NoContent);
                    return Ok(resp);
                }
                else
                {
                    //cache only valid & expired after 5 second
                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromSeconds(5))
                        .SetAbsoluteExpiration(TimeSpan.FromSeconds(5))
                        .SetPriority(CacheItemPriority.Normal)
                        .SetSize(1024);
                    _cache.Set(GlobalConst.Submit_Token, jwt.Token, cacheEntryOptions);
                }

                string updateResult = string.Empty;
                request.StationName = request.MachineIP = CommonHelper.GetClientMachineName(Request);
                var loct2 = _Inventory360Service.GetInv360LocationByIPAddress(request.MachineIP);
                Task.WaitAll(loct2);

                if (loct2.Result != null)
                {
                    request.Plant = loct2.Result.PlantName;
                }

                switch (request.PalletType)
                {
                    case GlobalConst.PALLETTYPE_MTO:
                        updateResult = MTOBLL.CheckInPallet(_EwareNaviService, _floorSystemrService, request, jwt, _appSettings.PostWebAdmin);
                        break;
                    case GlobalConst.PALLETTYPE_MTS:
                        updateResult = MTSBLL.CheckInPallet(_Inventory360Service, _floorSystemrService, request, jwt, _appSettings.PostWebAdmin);
                        break;

                }

                if (!String.IsNullOrEmpty(updateResult))
                {
                    ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                    resp.ResponseMessage = "Unable to Check In Pallet : " + updateResult;
                    _logService.CaptureLog("POST", "CheckInPallet", request, resp, jwt);
                    return Ok(resp);
                }
                else
                {
                    ResponseModel resp = new ResponseModel(updateResult);
                    _logService.CaptureLog("POST", "CheckInPallet", request, resp, jwt);
                    return Ok(resp);
                }
            }
            catch (Exception e)
            {
                ResponseModel resp = new ResponseModel(HttpStatusCode.BadRequest);
                resp.ResponseMessage = e.Message;
                _logService.CaptureLog("POST", "CheckInPallet", request, resp, null);
                return BadRequest(resp);
            }
        }

        //[HttpPost("CheckInPallet")]
        //public IActionResult CheckInPalletCache([FromBody] CheckInPalletDTO request)
        //{
        //    ResponseModel resp = new ResponseModel("try");
        //    JwtDTO jwt = JWTHelper.GetUserFromJWT(Request.Headers);

        //    string userToken = string.Empty;

        //    _cache.TryGetValue(GlobalConst.Submit_Token, out userToken);

        //    if (!string.IsNullOrEmpty(userToken) && userToken == jwt.Token)
        //        return BadRequest(resp);


        //    var cacheEntryOptions = new MemoryCacheEntryOptions()
        //        .SetSlidingExpiration(TimeSpan.FromSeconds(10))
        //        .SetAbsoluteExpiration(TimeSpan.FromSeconds(10))
        //        .SetPriority(CacheItemPriority.Normal)
        //        .SetSize(1024);
        //    _cache.Set(GlobalConst.Submit_Token, jwt.Token, cacheEntryOptions);


        //    _logService.CaptureLog("POST", "CheckInPallet", request, resp, jwt);
        //    return Ok(resp);
        //}
    }
}
