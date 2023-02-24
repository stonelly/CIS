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
    public class MTSBLL
    {
        public static string IsValidPallet(List<PalletDetailDTO> palletDTOs, JwtDTO jwt)
        {
            PalletDetailDTO pallet = palletDTOs.FirstOrDefault();

            if(!pallet.NextLocation.ToLower().Equals(jwt.locationId.ToLower()))
                return EwareNaviConst.WARNING_MSG_WRONG_WAREHOUSE;             

            return string.Empty;
        }


        public static string CheckInPallet(IInventory360Service _Inventory360Service, IFloorSystemrService _IFloorSystemrService, CheckInPalletDTO checkInPalletDTO, JwtDTO jwt, bool isWebAdminPost)
        {
            bool _D365Post = false;
            if (isWebAdminPost)
            {
                _D365Post = _IFloorSystemrService.FSPostD365FromFGReceivedPallet(checkInPalletDTO.PalletNo, checkInPalletDTO.Plant, DateTime.Now).Result > 0;

                // failed post to webadmin
                if (!_D365Post)
                    return EwareNaviConst.WARNING_MSG_FAILED_POST_WEBADMIN;
            }

            checkInPalletDTO.LocationId = Int16.Parse(jwt.locationId);

            if (!_Inventory360Service.CheckInMTS(checkInPalletDTO).Result)
            {
                string errorMsg = string.Format(EwareNaviConst.WARNING_MSG_FAILED_CHECKIN, checkInPalletDTO.PalletNo);
                return errorMsg;
            }

            return string.Empty;
        }
    }
}
