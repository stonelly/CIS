using CIS.Common.Constants;
using CIS.Data.Model;
using CIS.Data.Model.Request;
using CIS.Data.Model.Response;
using CIS.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.BusinessLogic.Pallet
{
    public class MTOBLL
    {
        public static string IsValidPallet(IEwareNaviService _EwareNaviService, IFloorSystemrService _IFloorSystemrService, List<EWN_CompletedPalletDTO> eWN_CompletedPalletDTOLst, JwtDTO jwt, string palletNo)
        {
            bool isNormalPallet = false;

            List<DNSTOCKDTO> dnstocklst = _EwareNaviService.GetDNStockByPalletID(palletNo).Result;

            if (dnstocklst != null && dnstocklst.Count() > 0)
            {
                //checking to block if pallet performed IOT scan
                //if (_IFloorSystemrService.USP_EWN_ValidateIOTPallet(palletNo).Result)
                //    return EwareNaviConst.WARNING_MSG_PALLET_IOSSCANNED;

                bool isNotDuplicateStock = _EwareNaviService.CheckStockWarehouseCodeAreaNo(EwareNaviConst.WAREHOUSE_CODE_TRANSIT, EwareNaviConst.AreaNo_STAG, palletNo).Result;

                if (!isNotDuplicateStock)
                {
                    DNSTOCKDTO dnstock = dnstocklst.FirstOrDefault();
                    string errorMsg = string.Format(EwareNaviConst.WARNING_MSG_STOCKDUPLICATE, dnstock.WAREHOUSE_CODE, dnstock.AREA_NO, dnstock.LOCATION_NO);
                    return errorMsg;
                }
            }

            if (!_EwareNaviService.HasSOItemReserved(eWN_CompletedPalletDTOLst).Result)
                return EwareNaviConst.WARNING_MSG_SO_NO_RESERVERD;

            foreach(var ewnDto in eWN_CompletedPalletDTOLst)
            {
                if (ewnDto.QAPassed == 1)
                    isNormalPallet = true;
            }

            string PalletReserved = _EwareNaviService.HasReservedEmptyLocation(eWN_CompletedPalletDTOLst).Result;

            if(isNormalPallet && !String.IsNullOrEmpty(PalletReserved))
                return PalletReserved;

            string reservedWarehouse = _EwareNaviService.GetReservedWarehouse(eWN_CompletedPalletDTOLst).Result;

            if (!String.IsNullOrEmpty(reservedWarehouse) && !String.IsNullOrEmpty(jwt.location) && !reservedWarehouse.ToLower().Equals(jwt.location.ToLower()))
                return string.Format(EwareNaviConst.WARNING_MSG_WRONG_DESTINATION, reservedWarehouse);

            if (!_EwareNaviService.isProductionOutputCheckedOut(palletNo).Result)
                return EwareNaviConst.WARNING_MSG_NOT_CHECKOUT;


            return string.Empty;
        }


        public static string CheckInPallet(IEwareNaviService _EwareNaviService, IFloorSystemrService _IFloorSystemrService, CheckInPalletDTO checkInPalletDTO, JwtDTO jwt, bool isWebAdminPost)
        {
            bool isStockExist = false;
            bool _D365Post = false;

            List<DNSTOCKDTO> dnstocklst = _EwareNaviService.GetDNStockByPalletID(checkInPalletDTO.PalletNo).Result;

            if (dnstocklst != null && dnstocklst.Count() > 0)
            {
                isStockExist = true;
                bool isNotDuplicateStock = _EwareNaviService.CheckStockWarehouseCodeAreaNo(EwareNaviConst.WAREHOUSE_CODE_TRANSIT, EwareNaviConst.AreaNo_STAG, checkInPalletDTO.PalletNo).Result;

                if (!isNotDuplicateStock)
                {
                    DNSTOCKDTO dnstock = dnstocklst.FirstOrDefault();
                    string errorMsg = string.Format(EwareNaviConst.WARNING_MSG_STOCKDUPLICATE, dnstock.WAREHOUSE_CODE, dnstock.AREA_NO, dnstock.LOCATION_NO);
                    return errorMsg;
                };
            }

            if (isWebAdminPost)
            {
                _D365Post = _IFloorSystemrService.FSPostD365FromFGReceivedPallet(checkInPalletDTO.PalletNo, checkInPalletDTO.Plant, DateTime.Now).Result > 0;

                // failed post to webadmin
                if (!_D365Post)
                    return EwareNaviConst.WARNING_MSG_FAILED_POST_WEBADMIN;
                else
                {
                    _IFloorSystemrService.USP_EWN_UpdPalletCompltScannedTimeByCIS(checkInPalletDTO.PalletNo);
                }
            }

            if (isStockExist)
            {
                _EwareNaviService.UpdateCheckInStock(checkInPalletDTO.PalletNo, checkInPalletDTO.LocationName, GlobalConst.AREANO_STAG);
            }
            else
            {
                bool _isStockInserted = _EwareNaviService.IsStockInserted(checkInPalletDTO.PalletNo, GlobalConst.AREANO_STAG).Result;

                if(!_isStockInserted)
                {
                    foreach(var ewn in checkInPalletDTO.eWN_CompletedPalletList)
                    {
                        _EwareNaviService.InsertStock(checkInPalletDTO.PalletNo, checkInPalletDTO.LocationName, ewn.CustomerPONumber, ewn.Item, ewn.QAPassed.ToString(), "", ewn.PONumber, ewn.Qty.ToString(), checkInPalletDTO.UserId, checkInPalletDTO.UserId);
                    }
                }
            }

            return string.Empty;
        }
    }
}
